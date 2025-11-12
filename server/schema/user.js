import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
const secretKey = process.env.SECRET_KEY;
import Follow from "../models/follow.js";
import { redis } from "../config/redis.js";

export const userTypeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String!
    email: String!
    followers: [User]
  followings: [User]
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterForm {
    name: String
    username: String!
    email: String!
    password: String!
  }

  input LoginForm {
    email: String!
    password: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    searchUser(username: String!): [User]
  }

  type Mutation {
    register(body: RegisterForm!): User!
    login(body: LoginForm!): AuthPayload!
  }
`;

export const userResolvers = {
  Query: {
    users: async () => {
      return await User.findAll();
    },

    user: async (_parent, args) => {
      const cacheKey = `user:${args.id}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log("getUserById from cache");
        return JSON.parse(cached);
      }

      const found = await User.findById(args.id);
      if (!found) throw new Error("User not found");

      // ambil semua followers & following dari collection Follow
      const followersData = await Follow.findFollowers(args.id);
      const followingsData = await Follow.findFollowings(args.id);

      // followersData & followingsData udah punya struktur { follower: {...} }
      const followers = followersData.map(f => f.follower);
      const followings = followingsData.map(f => f.following);

      const result = {
        ...found,
        followers,
        followings,
      };

      await redis.set(cacheKey, JSON.stringify(result));
      return result;
    },



    searchUser: async (_parent, args) => {
      const { username } = args

      const users = await User.coll
        .find(
          { username: { $regex: username, $options: "i" } },
          { projection: { password: 0 } }
        )
        .toArray()

      return users
    },

  },

  Mutation: {
    register: async (_parent, args) => {
      const { name, username, email, password } = args.body;

      if (!name) throw new Error("Name is required");
      if (!username) throw new Error("Username is required");
      if (!email) throw new Error("Email is required");

      if (!email.includes("@")) throw new Error("Invalid email format");

      if (!password) throw new Error("Password is required");
      if (password.length < 5)
        throw new Error("Password must be at least 5 characters");

      const usernameUsed = await User.findByUsername(username);
      if (usernameUsed) throw new Error("Username already registered");

      const emailUsed = await User.findByEmail(email);
      if (emailUsed) throw new Error("Email already registered");

      const hashed = bcrypt.hashSync(password, 10);

      const now = new Date();
      const newUser = await User.create({
        name,
        username,
        email,
        password: hashed,
        createdAt: now,
        updatedAt: now,
      });

      delete newUser.password;
      return {
        ...newUser,
        followers: [],
        followings: [],
      };
    },

    login: async (_parent, args) => {
      const { email, password } = args.body;

      if (!email) throw new Error("Email is required");
      if (!password) throw new Error("Password is required");

      const user = await User.findByEmail(email);
      if (!user) throw new Error("Invalid email or password");

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) throw new Error("Invalid email or password");

      const token = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        secretKey
      );

      const followersData = await Follow.findFollowers(user._id);
      const followingsData = await Follow.findFollowings(user._id);

      const followers = followersData.map(f => f.follower);
      const followings = followingsData.map(f => f.following);

      const cleanUser = {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        followers,
        followings
      };

      return {
        token,
        user: cleanUser,
      };
    },

  },

};

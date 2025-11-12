import { redis } from "../config/redis.js";
import Follow from "../models/follow.js";

export const followTypeDefs = `#graphql
  scalar Date

  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: Date
    updatedAt: Date
  }

    type Mutation {
    followUser(followingId: ID!): Follow!
  }
`;

export const followResolvers = {
  Mutation: {
    followUser: async (_, { followingId }, contextValue) => {
      const user = await contextValue.auth(); 

      if (user._id.toString() === followingId)
        throw new Error("You cannot follow yourself");

      const existing = await Follow.findByPair(user._id, followingId);
      if (existing) throw new Error("Already following this user");

      const newFollow = await Follow.create({
        followerId: user._id,
        followingId,
      });

      await redis.del(`user:${followingId}`);
      await redis.del(`user:${user._id}`);

      return newFollow;
    },
  }

};

import 'dotenv/config'

import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone';
import { userResolvers, userTypeDefs } from './schema/user.js';
import User from './models/users.js';
import { postResolvers, postTypeDefs } from './schema/posts.js';
import jwt from 'jsonwebtoken'
import Post from './models/posts.js';
import { followResolvers, followTypeDefs } from './schema/follow.js';

const secretKey = process.env.SECRET_KEY;
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
  // introspection: true,
});

async function authMiddleware(req) {
  try {
    const authorization = req.headers.authorization || '';
    const [type, token] = authorization.split(' ');

    console.log("AUTH HEADER RAW:", authorization);
    console.log("TOKEN SEGMENTS:", token?.split('.').length);

    if (type !== 'Bearer' || !token || token.split('.').length !== 3) {
      throw new Error('Invalid or malformed token');
    }

    const payload = jwt.verify(token, secretKey);
    console.log("JWT PAYLOAD:", payload);


    const user = await User.findById(payload._id);
    if (!user) throw new Error('Unauthorized');

    return user;
  } catch (error) {
    console.log(error);

    throw new Error('Catch error: Unauthorized');
  }
}

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: async ({ req }) => {
    return {
      auth: async () => {
        return await authMiddleware(req);
      },

      ownerOnly: async (postId) => {
        const user = await authMiddleware(req);
        const post = await Post.findOne(postId);

        if (!post) throw new Error('Post not found');

        if (post.authorId.toString() !== user._id.toString()) {
          throw new Error('Forbidden access');
        }

        return true;
      },
    };
  }
}).then(result => {
  console.log(`🚀  Server ready at: ${result.url}`);
})
// import { redis } from "../config/redis.js"
import { redis } from "../config/redis.js";
import Post from "../models/posts.js"
import { ObjectId } from "mongodb"

export const postTypeDefs = `#graphql
  type Post {
    _id: ID!
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID!
    author: User
    comments: [Comments]
    likes: [Likes]
    createdAt: String!
    updatedAt: String!
  }

  type Comments {        #pke $push
    content: String!
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type Likes {        #pke $addToSet
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  input PostForm {
    content: String!
    tags: [String]
    imgUrl: String
  }

  input CommentForm {
    content: String!
  }

  type ResponseBody {
    message: String
  }

  type Query {
    getPosts: [Post]
    getPostById(_id: ID!): Post
  }

  type Mutation {
    addPost(body: PostForm): Post
    commentPost(_id: ID!, body: CommentForm): Post
    likePost(_id: ID!): ResponseBody
  }
`

export const postResolvers = {
    Query: {
        getPosts: async () => {
            const cachedPosts = await redis.get("posts:all");
            if (cachedPosts) {
                return JSON.parse(cachedPosts);
            }

            const posts = await Post.findAll();
            await redis.set("posts:all", JSON.stringify(posts));

            return posts;
        },

        getPostById: async (_, args) => {
            const { _id } = args;

            const cacheKey = `post:${_id}`;
            const cachedPost = await redis.get(cacheKey);
            if (cachedPost) {
                console.log(`getPostById ${_id} from Redis`);
                return JSON.parse(cachedPost);
            }

            const posts = await Post.coll.aggregate([
                { $match: { _id: new ObjectId(_id) } },
                {
                    $lookup: {
                        from: "users",
                        localField: "authorId",
                        foreignField: "_id",
                        as: "author",
                    },
                },
                { $unwind: "$author" },
            ]).toArray();

            const post = posts[0];

            await redis.set(cacheKey, JSON.stringify(post));

            return post;
        },
    },

    Mutation: {
        addPost: async (_, args, contextValue) => {
            const user = await contextValue.auth()
            const { body } = args

            if (!body.content) throw new Error("Content is required")

            const newPost = await Post.create({
                ...body,
                authorId: new ObjectId(user._id),
                comments: [],
                likes: [],
            })

            await redis.del("posts:all");

            return newPost
        },

        commentPost: async (_, args, contextValue) => {
            const user = await contextValue.auth()
            const { _id, body } = args

            const comment = {
                content: body.content,
                username: user.username,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            await Post.coll.updateOne(
                { _id: new ObjectId(_id) },
                { $push: { comments: comment } }
            )

            await redis.del("posts:all");
            await redis.del(`post:${_id}`);

            return await Post.findOne(_id)
        },

        likePost: async (_, args, contextValue) => {
            const user = await contextValue.auth()
            const { _id } = args

            const post = await Post.findOne(_id)

            const alreadyLiked = post.likes.some(like => like.username === user.username)
            if (alreadyLiked) {
                return { message: "You already liked this post!" }
            }

            await Post.coll.updateOne(
                { _id: new ObjectId(_id) },
                {
                    $push: {
                        likes: {
                            username: user.username,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        }
                    }
                }
            )

            await redis.del("posts:all")
            await redis.del(`post:${_id}`)

            return { message: "Liked successfully!" }
        }
        
    }
}

import { ObjectId } from "mongodb";
import { db } from "../config/mongodb.js";

export default class Post {
  static coll = db.collection("posts");

  static async findAll() {
    const aggregationPipeline = [
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          "author.password": 0, 
        },
      },
    ];

    return await this.coll.aggregate(aggregationPipeline).toArray();
  }

  static async findOne(_id) {
    const pipeline = [
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
      {
        $project: {
          "author.password": 0,
        },
      },
    ];

    const result = await this.coll.aggregate(pipeline).toArray();
    return result[0];
  }

  static async create(body) {
    const newPost = {
      content: body.content,
      tags: body.tags || [],
      imgUrl: body.imgUrl || null,
      authorId: new ObjectId(body.authorId),
      comments: [],
      likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await this.coll.insertOne(newPost);
    newPost._id = result.insertedId;
    return newPost;
  }

  static async update(_id, body) {
    await this.coll.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...body,
          updatedAt: new Date().toISOString(),
        },
      }
    );
    return await this.findOne(_id);
  }

  static async destroy(_id) {
    return await this.coll.deleteOne({ _id: new ObjectId(_id) });
  }

  static async addComment(_id, { content, username }) {
    const newComment = {
      _id: new ObjectId(),
      content,
      username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.coll.updateOne(
      { _id: new ObjectId(_id) },
      { $push: { comments: newComment } }
    );

    return newComment;
  }

  static async addLike(_id, username) {
    const newLike = {
      username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.coll.updateOne(
      { _id: new ObjectId(_id) },
      { $addToSet: { likes: newLike } }
    );

    return newLike;
  }
}

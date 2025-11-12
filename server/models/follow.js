import { ObjectId } from "mongodb";
import { db } from "../config/mongodb.js";

export default class Follow {
  static coll = db.collection("follows");

  static async findByPair(followerId, followingId) {
    return await this.coll.findOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
    });
  }

  static async create({ followerId, followingId }) {
    const now = new Date();
    const newFollow = {
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.coll.insertOne(newFollow);
    return { _id: result.insertedId, ...newFollow };
  }

  static async findFollowers(userId) {
    return await this.coll
      .aggregate([
        { $match: { followingId: new ObjectId(userId) } },
        {
          $lookup: {
            from: "users",
            localField: "followerId",
            foreignField: "_id",
            as: "follower",
          },
        },
        { $unwind: "$follower" },
        {
          $project: {
            _id: 0,
            "follower._id": 1,
            "follower.username": 1,
            "follower.name": 1,
          },
        },
      ])
      .toArray();
  }

  static async findFollowings(userId) {
    return await this.coll
      .aggregate([
        { $match: { followerId: new ObjectId(userId) } },
        {
          $lookup: {
            from: "users",
            localField: "followingId",
            foreignField: "_id",
            as: "following",
          },
        },
        { $unwind: "$following" },
        {
          $project: {
            _id: 0,
            "following._id": 1,
            "following.username": 1,
            "following.name": 1,
          },
        },
      ])
      .toArray();
  }
}

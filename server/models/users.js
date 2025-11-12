import { ObjectId } from "mongodb";
import { db } from "../config/mongodb.js";

export default class User {
    static coll = db.collection("users");

    static async findAll() {
        return await this.coll
            .find({}, { projection: { password: 0 } })
            .toArray();
    }

    static async findById(_id) {
        return await this.coll.findOne(
            { _id: new ObjectId(_id) },
            { projection: { password: 0 } }
        );
    }

    static async findByEmail(email) {
        return await this.coll.findOne({ email });
    }

    static async findByUsername(username) {
        return await this.coll.findOne({ username });
    }

    static async create(body) {
        const result = await this.coll.insertOne({
            ...body,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return {
            _id: result.insertedId,
            name: body.name,
            username: body.username,
            email: body.email,
        };
    }
}

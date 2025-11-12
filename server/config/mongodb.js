import 'dotenv/config'
import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGO_URL

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

await client.connect()
console.log("✅ MongoDB connected successfully")

export const db = client.db('social-media')

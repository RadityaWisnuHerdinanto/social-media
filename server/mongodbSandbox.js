
import { MongoClient, ServerApiVersion } from 'mongodb'

// DATABASE_URL = [prefix]://[username]:[password]@[host]

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // const database = client.db("sosmed");

    const db = client.db("sosmed");
    const postsColl = db.collection("posts");

    // await postsColl.insertOne({
    //  content: "xxx"
    // })

    const posts = await postsColl.find().toArray()
    console.log(posts, "<<<")

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

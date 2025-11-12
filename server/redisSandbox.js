import 'dotenv/config'
import Redis from "ioredis";
// console.log(process.env.REDIS_URL);

// ???
const redis = new Redis(process.env.REDIS_URL);


async function run(params) {
  await redis.del("posts:all")
  console.log("deleted cache posts:all");

  // // baca cache
  // const cacheData = await redis.get("posts:all")
  // console.log(cacheData, "<<< cacheData");

  // // simpan ke cache
  // await redis.set("posts:all", JSON.stringify([1, 2, 3]))
}

run()
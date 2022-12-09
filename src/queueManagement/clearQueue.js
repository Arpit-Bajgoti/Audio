const redisClient = require("../connections/redisConnection");

(async () => {
  await redisClient.connect();

 await redisClient.del("AV_POST_PROCESS_QUEUE");

  console.log("Deleted queue");

})()

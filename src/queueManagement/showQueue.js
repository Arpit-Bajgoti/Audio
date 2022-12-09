const redisClient = require("../connections/redisConnection");

(async () => {
  await redisClient.connect();

  const items = await redisClient.lRange("AV_POST_PROCESS_QUEUE", 0,-1);

  console.log("Q items:",items.length,items);

})()

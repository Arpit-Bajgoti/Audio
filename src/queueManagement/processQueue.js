const redisClient = require('../connections/redisConnection');
const consumeItemFromQueue = require("./consumeItemFromQueue");
const {log} = require("debug");
const globals = require("../../defs/globals");
const https = require("https");
const axios = require("axios");

global.processingItems = 0;

(async () => {
  try{
  await redisClient.connect();
  setInterval(async () => {
    try {
      console.log("Running Queue processor");

      if (global.processingItems > 4) {
        console.log("Processing overflow");
        return;
      }

      let queueItem = await redisClient.lPop("AV_POST_PROCESS_QUEUE");
      console.log("From Queue pop", queueItem);

      if (!queueItem) {
        console.log("Queue is empty");
        return;
      }

      let queueItemObj = JSON.parse(queueItem);

      if (queueItemObj.retryAttempts >= globals.processMaxRetryAttempts) {
        console.log("Item processing failed Reporting to service");
        try {
          await axios.post(globals.queueProcessWebhook, {...queueItemObj, status: "FAILED"}, {
            httpsAgent: new https.Agent({
              rejectUnauthorized: false
            })
          });
        } catch (e) {
          console.log("Failed to report failed item ", queueItemObj);
        }
        return;
      }

      console.log(queueItemObj);


      try {
        ++global.processingItems;
        await consumeItemFromQueue(queueItemObj);
        --global.processingItems;
      } catch (e) {
        console.log("Failed to consume queue item");
        console.log(e.message);
        --global.processingItems;
        await redisClient.rPush("AV_POST_PROCESS_QUEUE", JSON.stringify({
          ...queueItemObj,
          retryAttempts: queueItemObj.retryAttempts + 1,
          eventFailureReason: e.message
        }));

      }
    }
    catch (e) {
      console.log("Something went wrong processing", e.message);
    }

  }, globals.queueRerunDelay);

  }
  catch (e) {
    console.log("Failed to connect to redis", e.message);
  }

})()

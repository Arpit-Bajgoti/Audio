const redisClient = require("../connections/redisConnection");
const {log} = require("debug");
const samples = [
  {
    event: "GENERATE_TRANSCRIPT",
    status: "PENDING",
    inviteUuid: "1234567890abcdef",
    questionUuid: "1234567890abcdef",
    answerFileLink: "https://filesamples.com/samples/video/webm/sample_960x400_ocean_with_audio.webm",
    answerFileType: "video",
    retryAttempts: 0,
    eventProcessResult: null,
    eventFailureReason: null,
  },
  {
    event: "GENERATE_TRANSCRIPT",
    status: "PENDING",
    inviteUuid: "1234567890abcdef",
    questionUuid: "1234567890abcdef",
    answerFileLink: "https://s759labs.com/test.webm",
    answerFileType: "video",
    retryAttempts: 0,
    eventProcessResult: null,
    eventFailureReason: null,
  },
  {
    event: 'GENERATE_TRANSCRIPT',
    status: 'PENDING',
    inviteUuid: '4119d942-e88d-4d23-948c-4e2053b8a9f8',
    eventTime: 1648149447082,
    questionUuid: '3127bb2e-71d9-42b8-a4b2-913782d69a20',
    answerFileType: 'AUDIO',
    answerFileLink: 'https://skillcounty-dev-custom-task.s3.ap-south-1.amazonaws.com/4119d942-e88d-4d23-948c-4e2053b8a9f8%7C3127bb2e-71d9-42b8-a4b2-913782d69a20%7CNy8bq7Vb?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220324T191727Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86399&X-Amz-Credential=AKIAVKDDEKU7BWTD6POI%2F20220324%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=a875c8fc69f7cbe3d5c4fcedde793cdb8629ba6bb147348c724f774024f72dda',
    retryAttempts: 0,
    eventProcessResult: null,
    eventFailureReason: null
  }
];


(async () => {
  await redisClient.connect();

  Promise.all(samples.map( async (sample) => {
    try {
      await redisClient.rPush("AV_POST_PROCESS_QUEUE", JSON.stringify(sample));
    }
    catch (e) {
      console.log("Unable to add items to queue");
    }
  })).then(async () => {
    console.log("Finished adding items to queue");
    const items = await redisClient.lRange("AV_POST_PROCESS_QUEUE", 0, -1);
    // console.log(JSON.stringify(items));
    console.log(items);
  })


})()

const fs = require("fs");
const {log} = require("debug");
const tempFolderLoc = "temp";

const currentDeployEnvironment = process.env.SERVER_ENV || "dev";

console.log("SERVER_ENV: " + currentDeployEnvironment);

const envBasedGlobals = Object.freeze({
  dev: {
    queueProcessWebhook: "https://api.dev.skillcounty.com/hook/v1/av-service/transcript",
    processMaxRetryAttempts: 2,
    queueRerunDelay: 15000,
    redisUrl: "redis://172.105.37.253",
    redisPassword: "sk!ll123$"
  },
  prod:{
    queueProcessWebhook: "https://api.skillcounty.com/hook/v1/av-service/transcript",
    processMaxRetryAttempts: 3,
    queueRerunDelay: 5000,
    redisUrl: "redis://172.104.58.184",
    redisPassword: "J@!@mb3m@tA$321"
  }
});

console.log("ENV based globals: " + envBasedGlobals[currentDeployEnvironment]);

const globals = Object.freeze({
  tempFolderLoc,
  tempSpeechToTextSamples : `./${tempFolderLoc}/stt/samples`,
  tempSpeechToTextOutputs : `./${tempFolderLoc}/stt/outputs`,
  tempSpeechToTextInputs : `./${tempFolderLoc}/stt/inputs`,
  pythonRoot: "./python-analysis",
  gopRoot: "./gop",
  ...(envBasedGlobals[currentDeployEnvironment] || envBasedGlobals["dev"])
});

// Create paths
[globals.tempSpeechToTextOutputs,globals.tempSpeechToTextSamples].forEach(path => {
  if (!fs.existsSync(path)){
    log(`Creating path ${path}`);
    fs.mkdirSync(path, { recursive: true });
  }
});


module.exports = globals;

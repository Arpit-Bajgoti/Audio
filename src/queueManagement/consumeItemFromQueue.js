const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { v4: uuidv4 } = require('uuid');
const path = require("path");
const globals = require("../../defs/globals");
const axios = require("axios");
const https = require("https");


function consumeItemFromQueue (queueItem) {

  return new Promise(async (resolve, reject) => {
    try{

      let generatedFilename = uuidv4();
      const getFilePath = (fileName) => `/audioProcess/${fileName}`;

      let fullFileName = null;
      if(queueItem.answerFileType.toUpperCase() === "VIDEO"){
        fullFileName = generatedFilename + ".webm";
      }
      else {
        fullFileName = generatedFilename + ".weba";
      }

      try{
        await exec("cd temp");

        await exec(`wget -O ${getFilePath(fullFileName)} "${queueItem.answerFileLink}"`);
        const ffmpegConvertCommand = queueItem.answerFileType.toUpperCase() === "VIDEO" ? `ffmpeg -i ${getFilePath(fullFileName)} ${getFilePath(generatedFilename)}.wav` : `ffmpeg -i ${getFilePath(fullFileName)} -c:a pcm_f32le ${getFilePath(generatedFilename)}.wav`;

        console.log("Convert command", ffmpegConvertCommand, "Cd", `cd ${path.resolve(globals.gopRoot)}`);
        await exec(ffmpegConvertCommand);

        const audioAnalyzeCommand = `cd ${path.resolve(globals.gopRoot)} && python3 main.py --audio_file_name "${getFilePath(generatedFilename)}.wav" --get_prosody False`;
        console.log("Analyze command",audioAnalyzeCommand);

        const data = await exec(audioAnalyzeCommand);
        const transcript = JSON.parse(data.stdout).transcript;
        console.log("Transcript",transcript);
        const webHookData = {
          ...queueItem,
          eventProcessResult: transcript,
          status: "SUCCESS",
        };
        console.log("webHookData :",webHookData);

        await axios.post(globals.queueProcessWebhook, webHookData , {httpsAgent: new https.Agent({
            rejectUnauthorized: false
          })});
        console.log("Reported to webhook");
        Promise.all([
          exec(`rm ${getFilePath(fullFileName)}`),
          exec(`rm ${getFilePath(generatedFilename)}.wav`)
        ]).then(() => console.log("Files Deleted"))
          .catch((e) => console.log("Failed to delete some files",e.message));

        resolve("finished");
      }
      catch (e) {
        Promise.all([
          exec(`rm ${getFilePath(fullFileName)}`),
          exec(`rm ${getFilePath(generatedFilename)}.wav`)
        ]).then(() => console.log("Files Deleted"))
          .catch((e) => console.log("Failed to delete some files",e.message));
        reject(e);
      }
    }
    catch (e) {
      reject(e);
    }
  });

}

module.exports = consumeItemFromQueue;

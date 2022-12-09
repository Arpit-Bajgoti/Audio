const express = require('express');
const synthRouter = express.Router();

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
const globals = require("../../defs/globals");
const {log} = require("debug");

const client = new textToSpeech.TextToSpeechClient();

async function synthAudio(text) {

  // Construct the request
  const request = {
    input: {text: text.toLowerCase()},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-IN', ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'LINEAR16'},
  };
  const fileName = `${text.split(" ").join("_")}.mp3`;
  // Performs the text-to-speech request
  if(fs.existsSync(`${globals.tempSpeechToTextSamples}/${fileName}`)){
    log("File Already exists: " + fileName);
    return {fileName};
  }
  console.log("Fine does not exist: " + fileName);
  console.log("Google synthesizing audio: " + text);
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);

  await writeFile(`${globals.tempSpeechToTextSamples}/${fileName}`, response.audioContent, 'binary');
  console.log(`Audio content written to file: ${fileName}`);
  // return response;
  return {
    fileName
  }
}


/* GET users listing. */
synthRouter.get('/', async function(req, res, next) {
  try{
    const word = req.query.word.trim().toLowerCase().slice(0,100);
    console.log("Audio Request for word : ",word);
    const resp = await synthAudio(word);
    res.json(resp);
  }catch (e) {
    res.status(500);
    console.log(e);
    res.json({message: "Something went wrong", status: "failed"});
  }
});

module.exports = synthRouter;

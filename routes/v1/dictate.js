const express = require('express');
const  multer = require("multer");
const fs = require("fs");
const {exec} = require("child_process");
const { v4: uuidv4 } = require('uuid');
const path = require("path");
const globals = require("../../defs/globals");
const {log} = require("debug");

const fileSizeLimit = {fileSize: 1024 * 1024 * 10}; // 10Mb file limit

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,globals.tempSpeechToTextInputs);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = (req.headers["request-id"] || uuidv4())+path.extname(file.originalname);
    const generatedFilename = "audioIn" + '-' + uniqueSuffix;
    console.log(generatedFilename,file);
    cb(null, generatedFilename);
  },
})

function uploadFilter (req, file, cb) {
  // if file is not audio don't save and return 500
  console.log("FileFilter did Run", file);
  if(/audio.*/.test(file.mimetype)){
    console.log("File is of Audio format");
    cb(null, true);
    return;
  }
  console.log("File is of NOT Audio format");
  cb("File is not of Audio format",false);
}

const dictationRouter = express.Router();
const uploadHandle = multer({storage: storage,fileFilter: uploadFilter, limits: fileSizeLimit});

dictationRouter.post("/", uploadHandle.single( 'audioInput'),
  function (req,res,next)
  {
    // if(!req.header.reqId){
    //   res.status(502);
    //   res.json({status : "failed",message: "Missing Request Id"})
    // }

    try{

      console.log("File,",req.file, req.files);

      const wordToCheck = req.body["wordToCheck"].trim().toLowerCase().slice(0,100);
      const fileNameAudiosAmigos =  wordToCheck.split(" ").join("_");
      const audioSamplePath = `${globals.tempSpeechToTextSamples}/${fileNameAudiosAmigos}.mp3`;
      const audioInput = req.file;

      const wavFilePath = path.resolve(globals.tempSpeechToTextInputs+"/"+path.basename(audioInput.path, path.extname(audioInput.path))+".wav");

      console.log("Word", wordToCheck);
      console.log("Audio FileName", fileNameAudiosAmigos);
      console.log("Audio Input path", audioInput.path);
      console.log("Wav file path", wavFilePath);

      // console.log(path.resolve(globals.pythonRoot + "/main.py"),globals.pythonRoot, path.resolve(audioSample.path), audioSample.path, path.resolve(audioInput.path), audioInput.path);
      const ffmpegConvertCommand =`ffmpeg -i ${path.resolve(audioInput.path)} -c:a pcm_f32le ${wavFilePath}`;
      console.log("Convert command", ffmpegConvertCommand);
      exec(ffmpegConvertCommand,
        (err, stdout,stderr) => {
          if(err){
            console.log("Error Converting file",stderr);
            res.status(500);
            console.log(err.message);
            res.json({status: "failed", message: "Output parsing failed"});
          }
          console.log(stdout);
          const audioAnalyzeCommand = `cd ${path.resolve(globals.pythonRoot)} && python3 ${path.resolve(globals.pythonRoot + "/main.py")} --word "${wordToCheck}" --s1 ${path.resolve(audioSamplePath)} --s2 ${wavFilePath}`;
          console.log("Analyze command: " + audioAnalyzeCommand);
          exec(audioAnalyzeCommand,
            (err, stdout, stderr) => {
              if (err) {
                console.error(err);
                res.status(500);
                res.json({status: "failed", message: "Something went wrong"});
                return;
              }
              console.log(stdout);
              res.json({status: "successful", output: JSON.parse(stdout.replace(/'/g,'"'))});
            });
        });

    }catch (e){
      res.status(500);
      console.log(e.message);
      res.json({status: "failed", message: "Output parsing failed"});
    }finally {
      console.log("Finished Dictate Processing");
    }

  })


module.exports = dictationRouter;

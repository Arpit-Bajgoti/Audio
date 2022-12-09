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

const transcriptRouter = express.Router();
const uploadHandle = multer({storage: storage,fileFilter: uploadFilter, limits: fileSizeLimit});

transcriptRouter.post("/", uploadHandle.single( 'audioInput'),
  function (req,res,next)
  {
    try{

      console.log("File,",req.file, req.files);
      const audioInput = req.file;

      const prosody = req.body.prosody ? "True" : "False";

      const wavFilePath = path.resolve(globals.tempSpeechToTextInputs+"/"+path.basename(audioInput.path, path.extname(audioInput.path))+".wav");

      console.log("Audio Input path", audioInput.path);
      console.log("Wav file path", wavFilePath);


      const ffmpegConvertCommand =`ffmpeg -i ${path.resolve(audioInput.path)} -c:a pcm_f32le ${wavFilePath}`; // converting weba to wav
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
          const audioAnalyzeCommand = `cd ${path.resolve(globals.gopRoot)} && python3 ${path.resolve(globals.gopRoot + "/main.py")} --audio_file_name "${wavFilePath}" --get_prosody ${prosody}`;
          console.log("Analyze command: " + audioAnalyzeCommand);
          exec(audioAnalyzeCommand,
            (err, stdout, stderr) => {
              if(err) {
                console.error(err);
                res.status(500);
                res.json({status: "failed", message: "Something went wrong"});
                return;
              }
              console.log(stdout);
              res.json({status: "successful", output: JSON.parse(stdout.replace(/'/g,'"'))});

              fs.unlink(wavFilePath, (e)=> {
                if(e){
                  console.log("File deletion failed :", wavFilePath);
                }
                else
                console.log("File Deleted :", wavFilePath);
              });

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


module.exports = transcriptRouter;

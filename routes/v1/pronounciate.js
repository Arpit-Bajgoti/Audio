const express = require('express');
const  multer = require("multer");
const fs = require("fs");
const {exec} = require("child_process");
const { v4: uuidv4 } = require('uuid');
const path = require("path");
const globals = require("../../defs/globals");

const fileSizeLimit = {fileSize: 1024 * 1024 * 10}; // 10Mb file limit

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file.fieldname === "audioInput"){
      cb(null,globals.tempSpeechToTextInputs);
    }else {
      cb(null, globals.tempSpeechToTextSamples);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = (req.headers["request-id"] || uuidv4())+path.extname(file.originalname);
    const generatedFilename = file.fieldname + '-' + uniqueSuffix;
    console.log(generatedFilename,file);
    cb(null, generatedFilename);
  },
})

function uploadFilter (req, file, cb) {
  // if file is not audio don't save and return 500
  console.log("FileFilter Ran", file);

  if(/audio.*/.test(file.mimetype)){
    console.log("File is of Audio format");
    cb(null, true);
    return;
  }
  console.log("File is of NOT Audio format");
  cb("File is not of Audio format",false);
}

const pronunciationRouter = express.Router();
const uploadHandle = multer({storage: storage,fileFilter: uploadFilter, limits: fileSizeLimit});

pronunciationRouter.post("/",
  uploadHandle.fields([{name: 'audioSample', maxCount: 1}, {name: 'audioInput', maxCount: 1}]),
  async function (req,res,next)
  {
    // if(!req.header.reqId){
    //   res.status(502);
    //   res.json({status : "failed",message: "Missing Request Id"})
    // }
    try {
      const audioSample = req.files['audioSample'][0];
      const audioInput = req.files['audioInput'][0];
      const wordToCheck = req.body["wordToCheck"];

      console.log("File Uploaded", wordToCheck);
      // console.log(path.resolve(globals.pythonRoot + "/main.py"),globals.pythonRoot, path.resolve(audioSample.path), audioSample.path, path.resolve(audioInput.path), audioInput.path);
      exec(`cd ${path.resolve(globals.pythonRoot)} && python3 ${path.resolve(globals.pythonRoot + "/main.py")} --word ${wordToCheck} --s1 ${path.resolve(audioSample.path)} --s2 ${path.resolve(audioInput.path)}`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            res.status(500);
            res.json({status: "failed", message: "Something went wrong"});
            return;
          }
          console.log(stdout);
          try {
            res.json({status: "successful", output: JSON.parse(stdout.replace(/'/g, '"'))});
          } catch (e) {
            res.status(500);
            res.json({status: "failed", message: "Output parsing failed"});
          }
        });
    }
    catch (e) {
      res.status(500);
      console.log(e.message);
      res.json({status: "failed", message: e.message});
    }

  })


module.exports = pronunciationRouter;

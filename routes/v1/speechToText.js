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
    cb(null, globals.tempSpeechToTextSamples);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
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

const speechToTextRouter = express.Router();
const uploadHandle = multer({storage: storage,fileFilter: uploadFilter, limits: fileSizeLimit});

speechToTextRouter.post("/",uploadHandle.single('audio'),async function (req,res,next){
  let audioFile =  req.file;
  console.log("File Uploaded");
  console.log(req.file, req.body);

  // exec(`python <filename> ${audioFile.path}`);

  res.json({status: "successful"});

})


module.exports = speechToTextRouter;

let express = require('express');
const globals = require("../../defs/globals");
let audioFilesRouter = express.Router();

/* GET users listing. */
audioFilesRouter.use(express.static(globals.tempSpeechToTextSamples));

module.exports = audioFilesRouter;

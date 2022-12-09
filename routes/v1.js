let express = require('express');
const testRouter = require('./v1/test');
const speechToTextRouter = require("./v1/speechToText");
const pronunciationRouter = require("./v1/pronounciate");
const synthRouter = require("./v1/synth");
const audioFilesRouter = require("./v1/audioFiles");
const dictationRouter = require("./v1/dictate");
const wordListRouter = require("./v1/wordList");
const transcriptRouter = require("./v1/transcript");


let router = express.Router();

router.use("/health",testRouter);
router.use("/speechToText",speechToTextRouter);
router.use("/pronunciate",pronunciationRouter);
router.use("/synth",synthRouter);
router.use("/audio-files",audioFilesRouter);
router.use("/dictate",dictationRouter);
router.use("/transcript",transcriptRouter);
router.use("/words",wordListRouter);

module.exports = router;

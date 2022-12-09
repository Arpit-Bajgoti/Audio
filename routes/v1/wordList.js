const express = require('express');
const wordListRouter = express.Router();

const preDefWord = require("../../defs/preDefWords.json");

wordListRouter.get("/",(req,res,next) => {
  res.json(preDefWord);
})

module.exports = wordListRouter;

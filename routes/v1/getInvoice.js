const express = require('express');
const react = require("react");

const getInvoiceRouter = express.Router();

const { default: InvoiceTemplate } = await import('./../../src/pdfTemplates/InvoiceV1');

getInvoiceRouter.post("/invoice", async (req,res) => {

  const {
    name,
    companyName,
    date,
    items,
    total
  } = req.data;



})

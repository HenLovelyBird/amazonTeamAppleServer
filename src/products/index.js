const express = require("express");
const {readFile, writeFile} = require ("fs-extra");
const path = require("path");
const {check,validationResult, sanitize} = require("express-validator");
const router = express.Router();
const filePath = path.join(__dirname, "products.json");


router.get('/', async (req, res)=> {
    const buffer = await readFile(filePath);
    const fileContent = buffer.toString();
    const productsArray = JSON.parse(fileContent);
    // console.log(productArray);
    res.send(productsArray);
});


module.exports = router;
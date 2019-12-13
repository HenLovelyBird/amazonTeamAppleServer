const express = require("express");
const {readFile, writeFile} = require ("fs-extra");
const path = require("path");
const {check,validationResult, sanitize} = require("express-validator");
const router = express.Router();
const filePath = path.join(__dirname, "products.json");
const uuid  = require("uuid/v3");

router.get('/', async (req, res)=> {
    const buffer = await readFile(filePath);
    const fileContent = buffer.toString();
    const productsArray = JSON.parse(fileContent);
    // console.log(productsArray);
    res.send(productsArray);
});

router.get('/:id', async (req, res)=>{
    const buffer = await readFile(filePath);
    const fileContent = buffer.toString();
    const productsArray = JSON.parse(fileContent);
    const findProduct = productsArray.find(
        product => product._id === req.params.id
    );
    // console.log(req.params.id);
    if (findProduct){
        res.send(findProduct);
    } else {
        res.status(401).send(`product ${req.params.id} not found!`);
    }
    
});

module.exports = router;
const express = require("express");
const { readFile, writeFile } = require("fs-extra");
const uuidv1 = require("uuid/v1");
var multer = require("multer");
const path = require("path");
const { check, validationResult, sanitize } = require("express-validator");
const router = express.Router();
const filePath = path.join(__dirname, "products.json");

router.get("/", async (req, res) => {
  const buffer = await readFile(filePath);
  const fileContent = buffer.toString();
  const productsArray = JSON.parse(fileContent);
  // console.log(productArray);
  res.send(productsArray);
});

var upload = multer({});
router.post("/", upload.none(), async (req, res) => {
  const buffer = await readFile(filePath);
  const fileContent = buffer.toString();
  const productsArray = JSON.parse(fileContent);
  let newProduct = {
    ...req.body,
    _id: uuidv1(),
    createdAt: new Date()
  };
  productsArray.push(newProduct);
  const newProductbuffer = JSON.stringify(productsArray);
  await writeFile(filePath, newProductbuffer);
  res.send(newProduct);
});

module.exports = router;

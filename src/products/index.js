const express = require("express");
const { readFile, writeFile } = require("fs-extra");
const uuidv1 = require("uuid/v1");
var multer = require("multer");
const path = require("path");
const { check, validationResult, sanitize } = require("express-validator");
const router = express.Router();
const filePath = path.join(__dirname, "products.json");



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

var upload = multer({});
router.post("/", upload.single("productImg"), async (req, res) => {
  const newID = uuidv1();
  const { originalname, buffer } = req.file;
  const ext = path.extname(originalname);
  const ImgNameToBeSaved = newID.concat(ext);
  let ImgFilePath = path.join(__dirname, "img", ImgNameToBeSaved);
  await writeFile(ImgFilePath, buffer);
  let allProducts = await readAllFile();
  let newProduct = {
    ...req.body,
    image: ImgFilePath,
    _id: newID,
    createdAt: new Date()
  };
  allProducts.push(newProduct);
  const newProductbuffer = JSON.stringify(allProducts);
  await writeFile(filePath, newProductbuffer);
  res.send(newProduct);
});

const readAllFile = async ()=>{ 
    const buffer = await readFile(filePath)  
    const content = buffer.toString();
    return JSON.parse(content)
  };

router.put("/:id", upload.single("productImg"), async (req, res) => {

  let allProducts = await readAllFile();
  let product = allProducts.find(oneProduct => oneProduct._id == req.params.id);
  if (product) {    
    const { originalname, buffer } = req.file;
    const ext = path.extname(originalname);
    const ImgNameToBeSaved = req.params.id.concat(ext);
    let ImgFilePath = path.join(__dirname, "img", ImgNameToBeSaved);
    await writeFile(ImgFilePath, buffer);
    let updatedProduct = {
        ...req.body,
        image: ImgFilePath,
        updatedAt: new Date()
      };
    let mergedProduct = Object.assign(product, updatedProduct);
    let postionOfProduct = allProducts.indexOf(product);
    allProducts[postionOfProduct] = mergedProduct;
    await writeFile(filePath, JSON.stringify(allProducts));
    res.send(mergedProduct);
  } else {
    res.status(404).send("Not Found bro...damn it!!!");
  }
});






router.delete("/:id", async (req,res)=>{
   let allProducts = await readAllFile();
    let productsToRemain = allProducts.filter(product => product._id != req.params.id)

    if(productsToRemain.length < allProducts.length ){
       await writeFile(filePath, JSON.stringify(productsToRemain));
       res.send("removed") 

    }

    else{
        res.status(404).send("Not Found...damn it!!!") 
    }


})


module.exports = router;



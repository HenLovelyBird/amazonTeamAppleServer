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





const readAllFile = async ()=>{ 
    const buffer = await readFile(filePath)  
    const content = buffer.toString();
    return JSON.parse(content)
  }


router.put("/:id", async (req, res) =>{  

    var allProducts = await readAllFile();

    let product = allProducts.find(oneProduct => oneProduct._id == req.params.id);
    if (product){
       
        let newProduct = {
            ...req.body,
           
            UpdatedAt: new Date()
          };

         let mergedProduct = Object.assign(product, newProduct);
         let postionOfProduct = allProducts.indexOf(product);
         allProducts[postionOfProduct] = mergedProduct;

         
         await writeFile(filePath, JSON.stringify(allProducts));         
         res.send(mergedProduct);

    }
     else{
        res.status(404).send("Not Found bro...damn it!!!");
 }

 })






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



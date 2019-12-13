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





const readAllFile = async ()=>{ 
    const buffer = await readFile(filePath)  
    const content = buffer.toString();
    return JSON.parse(content)
  }


router.put("/:id", async (req, res) =>{
    let allProducts = await readAllFile();

    let product = allProducts.find(oneProduct => oneProduct._id == req.params.id)
    if (product){
        let mergedProduct = Object.assign(product, req.body)
        let postionOfProduct = allProducts.indexOf(product)
        allProducts[postionOfProduct] = mergedProduct
        await writeFile(filePath, JSON.stringify(this.allProducts));
        res.send(mergedProduct);

    }

    else{
        res.status(404).send("Not Found bro...damn it!!!") 

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
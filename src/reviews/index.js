const express = require("express");
const { readFile, writeFile } = require("fs-extra");
const path = require("path");
const router = express.Router();
const filePath = path.join(__dirname, "reviews.json");




const readAllFile = async ()=>{ 
    const buffer = await readFile(filePath)  
    const content = buffer.toString();
    return JSON.parse(content)
  }

router.get('/', async (req, res)=> {
    const reviewsArray = await readAllFile();
    res.send(reviewsArray);
});


router.get('/:id', async (req, res)=>{
    const reviewsArray = await readAllFile();
    const findReview = reviewsArray.find(
        review => review._id === req.params.id
    );
    
    if (findReview){
        res.send(findReview);
    } else {
        res.status(401).send(`product ${req.params.id} not found!`);
    }
});  


// (GET /products/{id}/Reviews)

router.get("/product/:productID", async (req, res) => {

      const reviewsArray = await readAllFile();

      const reviewElementId = reviewsArray.filter(
        review => review.elementId === req.params.productID)

      if (reviewElementId) {
       
        res.send(reviewElementId);
      } else {
        res.status(401).send(`product with element ID ${req.params.id} not found!`);
      }
    })
 












router.delete("/:id", async (req,res)=>{
    let allReviews = await readAllFile();
     let reviewsToRemain = allReviews.filter(review => review._id != req.params.id)
 
     if(reviewsToRemain.length < allReviews.length ){
        await writeFile(filePath, JSON.stringify(reviewsToRemain));
        res.send("removed") 
 
     }
 
     else{
         res.status(404).send("Not Found...damn it!!!") 
     }
 
 
 })


module.exports = router;
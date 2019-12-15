
const readAllFile = async ()=>{ 
    const buffer = await readFile(filePath)  
    const content = buffer.toString();
    return JSON.parse(content)
  }


router.put("/:id", async (req, res) =>{  

    var allReviews = await readAllFile();

    let review = allReviews.find(oneReview => oneReview._id == req.params.id);
    if (review){
       
        
         let mergedReview = Object.assign(review, req.body);
         let postionOfReview = allReviews.indexOf(review);
         allReviews[postionOfReview] = mergedReview;

         
         await writeFile(filePath, JSON.stringify(allReviews));         
         res.send(mergedReview);

    }
     else{
        res.status(404).send("Not Found bro...damn it!!!");
 }

 })

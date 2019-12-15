const express = require("express");
const router = express.Router();
const path = require("path");
const filePath = path.join(__dirname, "reviews.json");
const { readFile, writeFile } = require("fs-extra");
const uuidv1 = require("uuid/v1");

const readAllFile = async () => {
  const buffer = await readFile(filePath);
  const content = buffer.toString();
  return JSON.parse(content);
};

router.get("/", async (req, res) => {
  const reviewsArray = await readAllFile();
  res.send(reviewsArray);
});

router.get("/:id", async (req, res) => {
  const reviewsArray = await readAllFile();
  const findReview = reviewsArray.find(review => review._id === req.params.id);

  if (findReview) {
    res.send(findReview);
  } else {
    res.status(401).send(`product ${req.params.id} not found!`);
  }
});

// (GET /products/{id}/Reviews)

router.get("/product/:productID", async (req, res) => {
  const reviewsArray = await readAllFile();

  const reviewElementId = reviewsArray.filter(
    review => review.elementId === req.params.productID
  );

  if (reviewElementId.length > 0) {
    res.send(reviewElementId);
  } else {
    res
      .status(401)
      .send(`product with element ID ${req.params.productID} not found!`);
  }
});

router.delete("/:id", async (req, res) => {
  let allReviews = await readAllFile();
  let reviewsToRemain = allReviews.filter(
    review => review._id != req.params.id
  );

  if (reviewsToRemain.length < allReviews.length) {
    await writeFile(filePath, JSON.stringify(reviewsToRemain));
    res.send("removed");
  } else {
    res.status(404).send("Not Found...damn it!!!");
  }
});

router.put("/:id", async (req, res) => { 
  const buffer = await readFile(filePath);
  const fileContent = buffer.toString();
  let reviewsArray = JSON.parse(fileContent);
  let singleReview = reviewsArray.find(aReview => aReview._id == req.params.id);
  if (singleReview) {
      let modifyReview = Object.assign(singleReview, req.body);
      let positionOfReview = reviewsArray.indexOf(singleReview);
      reviewsArray[positionOfReview] = modifyReview;
      await writeFile(filePath, JSON.stringify(reviewsArray));
      res.send(modifyReview);
  } else {
      res.status(404).send("Review not found!");
  }
  
});

router.post("/", async (req, res) => {
  const buffer = await readFile(filePath);
  const fileContent = buffer.toString();
  let reviewsArray = JSON.parse(fileContent);
  const newReview = {
    ...req.body,
    _id: uuidv1(),
    createdat: new Date()
  };
  reviewsArray.push(newReview);
  await writeFile(filePath, JSON.stringify(reviewsArray));
  res.status(201).send(`${newReview._id}`);
});



module.exports = router;

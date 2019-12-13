const express = require("express");
const router = express.Router();
const path = require("path");
const filePath = path.join(__dirname, "reviews.json");
const { readFile, writeFile, writeFileSync } = require("fs-extra");
const uuidv1 = require("uuid/v1");


router.put('/:id', async (req, res) => {
    const modifyReview = req.body;
    const buffer = await readFile(filePath);
    const fileContent = buffer.toString();
    let reviewsArray = JSON.parse(fileContent);
    await writeFile(filePath, JSON.stringify(reviewsArray));
    res.send(modifyReview);
});

router.post('/', async (req, res) =>{
    const buffer = await readFile(filePath);
    const fileContent = buffer.toString();
    let reviewsArray = JSON.parse(fileContent);
    const newReview = {
        ...req.body,
        _id: uuidv1() && reviewsArray.length + 1, 
        createdat: new Date()
    };
    reviewsArray.push(newReview);
    await writeFileSync(filePath, JSON.stringify(reviewsArray));
    res.status(201).send(`${newReview._id}`);
});


module.exports = router;
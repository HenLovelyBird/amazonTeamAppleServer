const express = require("express");
const productsRouter = require("./src/products");
// const reviewsRouter = require("./src/reviews");
const cors = require ("cors");
const server = express()
require('dotenv').config();
const port = process.env.PORT;

server.use(express.json());
server.use(cors());
server.use("/products", productsRouter);
// server.use('/reviews', reviewsRouter);

server.listen(port, () => {
    console.log(`Heeeey, your server is running on port ${port}!`);
});
const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = 3000;

app.use(express.json());

const PRODUCTS_FILE = "products.json";
const REVIEWS_FILE = "reviews.json";


const readData = (file) => {
    if (!fs.existsSync(file)) return [];
    const data = fs.readFileSync(file);
    return JSON.parse(data);
};


const writeData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};


app.post("/products", (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: "Name and description are required" });
    }
    const products = readData(PRODUCTS_FILE);
    const newProduct = { id: uuidv4(), name, description, averageRating: 0 };
    products.push(newProduct);
    writeData(PRODUCTS_FILE, products);
    res.status(201).json(newProduct);
});

app.get("/products", (req, res) => {
    let products = readData(PRODUCTS_FILE);
    if (req.query.sortBy === "rating") {
        products.sort((a, b) => b.averageRating - a.averageRating);
    }
    res.json(products);
});

app.post("/reviews", (req, res) => {
    const { productId, rating, message } = req.body;
    if (!productId || typeof rating !== "number" || rating < 1 || rating > 5 || !message) {
        return res.status(400).json({ error: "Invalid input" });
    }
    const products = readData(PRODUCTS_FILE);
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    
    const reviews = readData(REVIEWS_FILE);
    const newReview = { id: uuidv4(), productId, timestamp: new Date().toISOString(), rating, message };
    reviews.push(newReview);
    writeData(REVIEWS_FILE, reviews);
    
  
    const productReviews = reviews.filter(r => r.productId === productId);
    product.averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    writeData(PRODUCTS_FILE, products);
    
    res.status(201).json(newReview);
});


app.get("/reviews", (req, res) => {
    const reviews = readData(REVIEWS_FILE).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(reviews);
});


app.get("/products/:id", (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    
    const reviews = readData(REVIEWS_FILE).filter(r => r.productId === req.params.id);
    res.json({ ...product, reviews });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

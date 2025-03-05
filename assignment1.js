const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

let books = [];
let idCounter = 1;


app.post('/books', (req, res) => {
    const { title, author, price } = req.body;
    if (!title || !author || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: "All fields are required and price must be a positive number" });
    }
    const newBook = { id: idCounter++, title, author, price };
    books.push(newBook);
    res.status(201).json(newBook);
});


app.get('/books', (req, res) => {
    res.status(200).json(books);
});


app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
});


app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    const { title, author, price } = req.body;
    if (!title || !author || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: "All fields are required and price must be a positive number" });
    }
    book.title = title;
    book.author = author;
    book.price = price;
    res.status(200).json(book);
});


app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) {
        return res.status(404).json({ error: "Book not found" });
    }
    books.splice(bookIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

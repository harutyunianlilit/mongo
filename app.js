const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const url =
  'mongodb+srv://harutyunianlilit:Lily1996@cluster0.p36ewt0.mongodb.net/?retryWrites=true&w=majority';
const dbName = "Books";
const collectionName = "BooksCollection";

MongoClient.connect(url, (err, client) => {
  if (err) throw err;git init

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  app.get("/books", (req, res) => {
    collection.find({}).toArray((err, books) => {
      if (err) throw err;
      res.json(books);
    });
  });

  app.get("/books/:id", (req, res) => {
    const { id } = req.params;
    collection.findOne({ id: Number(id) }, (err, book) => {
      if (err) throw err;

      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: "Book not found" });
      }
    });
  });

  app.post("/books", (req, res) => {
    const books = req.body;
  
    collection.insertMany(books, (err, result) => {
      if (err) throw err;
      res.status(201).json(result.insertedIds);
    });
  });

  app.put("/books/:id", (req, res) => {
    const { id } = req.params;
    const { title, author } = req.body;

    collection.findOneAndUpdate(
      { id: Number(id) },
      { $set: { title, author } },
      { returnOriginal: false },
      (err, result) => {
        if (err) throw err;

        if (result.value) {
          res.json(result.value);
        } else {
          res.status(404).json({ error: "Book not found" });
        }
      }
    );
  });

  app.delete("/books/:id", (req, res) => {
    const { id } = req.params;

    collection.findOneAndDelete({ id: Number(id) }, (err, result) => {
      if (err) throw err;

      if (result.value) {
        res.json(result.value);
      } else {
        res.status(404).json({ error: "Book not found" });
      }
    });
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
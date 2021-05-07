"use strict";

const { v4: uuidv4 } = require("uuid");
const MongoClient = require("mongodb").MongoClient;

const connectionString = process.env.DB;
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const insert = async (client, newBook) => {
  await client.connect();
  const collection = client.db("myFirstDatabase").collection("books");
  const result = await collection.insertOne(newBook);
};

const getBooks = async (client) => {
  await client.connect();
  const collection = client.db("myFirstDatabase").collection("books");
  const cursor = await collection.find();
  let result = [];
  await cursor.forEach((el) =>
    result.push({
      _id: el._id,
      title: el.title,
      commentcount: el.comments.length,
    })
  );
  return result;
};

const deleteAll = async (client) => {
  await client.connect();
  const collection = client.db("myFirstDatabase").collection("books");
  await collection.drop();
};

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      const client = new MongoClient(connectionString, dbOptions);
      const books = await getBooks(client).catch(console.dir);
      client.close();
      res.send(books);
    })

    .post(function (req, res) {
      let title = req.body.title;
      console.log(req.body);
      if (title) {
        const newBook = {
          ...req.body,
          _id: uuidv4(),
          comments: [],
        };
        const client = new MongoClient(connectionString, dbOptions);
        insert(client, newBook).catch(console.dir);
        client.close();
        res.json({ title: newBook.title, _id: newBook._id });
      } else {
        res.status(400).send("missing required field title");
      }
    })

    .delete(function (req, res) {
      const client = new MongoClient(connectionString, dbOptions);
      deleteAll(client).catch(console.dir);
      client.close();
      res.send("complete delete successful");
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};

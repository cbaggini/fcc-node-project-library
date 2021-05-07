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

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function (req, res) {
      let title = req.body.title;
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
        res.send("missing required field title");
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
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

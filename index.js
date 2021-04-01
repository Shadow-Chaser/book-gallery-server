const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require("mongodb").ObjectID;
const cors = require('cors');
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

const port = process.env.PORT || 8000


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8cui.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db(`${process.env.DB_NAME}`).collection("books");
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  console.log("connected");

    app.post('/addBook', (req, res)=>{
        const newBook = req.body;
        // console.log(newBook);
    bookCollection.insertOne(newBook)
    .then(result => {
        //  console.log('inserted count', result.insertedCount);
         res.send(result.insertedCount>0)
     })

    })

    app.post('/addOrder', (req, res)=>{
      const newOrder = req.body;
      // console.log(newBook);
    orderCollection.insertOne(newOrder)
    .then(result => {
      //  console.log('inserted count', result.insertedCount);
       res.send(result.insertedCount>0)
    })

   })

    app.get('/orders', (req, res)=>{
      const queryEmail = req.query.email;
      orderCollection.find({ email: queryEmail})
      .toArray((err, orders) => {
        res.send(orders);
      })
    })

    app.get('/books', (req, res)=>{
      bookCollection.find()
      .toArray((err, books)=>{
        res.send(books)
      })
    })

    app.delete("/delete/:id", (req, res)=>{
      // console.log(req.params.id);
      bookCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result => {
        // console.log(result.deletedCount)
        res.send(result.deletedCount>0);
        
      })
    })

    app.get('/book/:id', (req, res)=>{
      bookCollection.find({_id:ObjectId(req.params.id)})
      .toArray((err, book)=>{
        res.send(book[0])
      })
    })

    app.get('/orderDetails/:orderId', (req, res)=>{
      orderCollection.find({_id:ObjectId(req.params.orderId)})
      .toArray((err, orderDetails)=>{
        res.send(orderDetails[0])
      })
    })


});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
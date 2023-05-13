const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middleware
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.uya6aoa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const servicesCollection = client.db('carsDoctor').collection('services');
    const booksCollection = client.db('carsDoctor').collection('bookings');

    app.get('/services', async (req, res) => {
        const cursor = servicesCollection.find();
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/services/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await servicesCollection.findOne(query);
      res.send(result)
    })


    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      console.log(booking)
      const result = await booksCollection.insertOne(booking);
      res.send(result)
    })

    app.get('/bookings', async(req, res) => {
      console.log(req.query.email)
      let query = {}
      if(req.query?.email){
        query = { email: req.query.email }
      }
      const result = await booksCollection.find(query).toArray()
      res.send(result)
    })


    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await booksCollection.deleteOne(query);
      res.send(result)
    })

    app.patch('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updateBooking = req.body
      console.log(updateBooking)
      const updateDoc = {
        $set: {
          status: updateBooking.status
        }
      }
      const result = await booksCollection.updateOne(filter, updateDoc);
      res.send(result)
    })

    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('doctor is running');
})

app.listen(port, () => {
    console.log(`doctor is running on port${port}`)
})
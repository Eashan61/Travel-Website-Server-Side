const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Setting middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mofim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

 try{
  await client.connect();
  const database = client.db('TravelHobe');
  const servicesCollection = database.collection('services');
  const ordersCollection = database.collection('orders');

  // Get all data
  app.get('/services', async(req, res) => {
   const cursor = servicesCollection.find({});
   const services = await cursor.toArray();
   res.send(services);
  });

  // GET Single Service
  app.get('/services/:id', async(req, res) => {
   const id = req.params.id;
   const query = {_id: ObjectId(id)};
   console.log('getting specific service', id);
   const service = await servicesCollection.findOne(query);
   res.json(service);

  })

  // Post Api
  app.post('/services', async(req, res)=> {
   const service = req.body;
   console.log('hit the post api', service);
   
   const result = await servicesCollection.insertOne(service);
   // console.log(result);
   res.json(result);

  });
  // Post Api
  app.post('/order', async(req, res)=> {
   const service = req.body;
   console.log('hit the post api', service);
   
   const result = await ordersCollection.insertOne(service);
   console.log(result);
   res.json(result);

  });
  // Get all data
  app.get('/order', async(req, res) => {
   const cursor = ordersCollection.find({});
   const order = await cursor.toArray();
   res.send(order);
  });
  app.delete('/order/:id', async(req, res) => {
   const id = req.params.id;
   const query = {_id:ObjectId(id)}
   const result = await ordersCollection.deleteOne(query);
   res.json(result);
   console.log(result);
  });
 }
 finally{
  // await client.close();
 }

}

run().catch(console.dir);


app.get('/', (req, res)=> {
 res.send('Running Genius Server');
});

app.get('/hello', (req, res) => {
 res.send('hello updated here')
})

app.listen(port, ()=> {
 console.log('Running Genius Server on port', port);
})
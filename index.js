const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 4000;
require("dotenv").config();

// middlewear

app.use(cors());
app.use(express.json());

// MongoDb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ofikfyh.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){
    try{
        const catagoriesCollection = client.db('resale-Bike').collection('catagories');
        const catagoriesProductCollection = client.db('resale-Bike').collection('catagoriesProducts');
        const usersCollection = client.db('resale-Bike').collection('users');
        const bookingsCollection = client.db('resale-Bike').collection('bookings');

        // catagories

        app.get('/catagories', async (req,res)=>{
            const query = {};
            const result = await catagoriesCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/catagory/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {catagoryId:(id)}
            const result = await catagoriesProductCollection.find(query).toArray()
            res.send(result)
        })
        app.post('/users', async(req,res)=>{
            const user = req.body;
            const results = await usersCollection.insertOne(user)
            res.send(results)
        })

        // catagory product part
        app.post('/catagoriesProducts', async(req,res)=>{
            const catagoriesProducts = req.body;
            const result = await catagoriesProductCollection.insertOne(catagoriesProducts)
            res.send(result);
        })
        app.get('/brandCatagories', async(req,res)=>{
            const query = {};
            const result = await catagoriesCollection.find(query).toArray();
            res.send(result);
        })

        // modal bookings
        app.post('/bookings', async(req,res)=>{
            const bookings = req.body;
            // console.log(bookings);
            const result = await bookingsCollection.insertOne(bookings)
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(err=> console.log(err))


app.get("/", (req, res) => {
  res.send("Resale Bike Is Running");
});

app.listen(port, () => {
  client.connect(err => {
     if(err){
      console.log(err);
     }
     else{
      console.log('Connected To Mongodb')
     }

    });

  console.log("Server is Running on", port);
});

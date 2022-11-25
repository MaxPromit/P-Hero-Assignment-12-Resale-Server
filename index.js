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
        const usersCollection = client.db('resale-Bike').collection('users');

        // catagories

        app.get('/catagories', async (req,res)=>{
            const query = {};
            const result = await catagoriesCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/catagory/:brand', async(req,res)=>{
            const brand = req.params.brand;
            console.log(brand)
            res.send({status: 'success'})
        })
        app.post('/users', async(req,res)=>{
            const user = req.body;
            const results = await usersCollection.insertOne(user)
            res.send(results)
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

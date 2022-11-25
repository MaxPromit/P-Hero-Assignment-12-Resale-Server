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

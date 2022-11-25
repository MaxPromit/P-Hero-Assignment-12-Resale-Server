const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 4000;
require('dotenv').config();


// middlewear

app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Resale Bike Is Running')
    
})

app.listen(port,()=>{
    // client.connect(err => {
    //    if(err){
    //     console.log(err);
    //    }
    //    else{
    //     console.log('Connected To Mongodb')
    //    }
        
    //   });
      
    console.log('Server is Running on', port)
})
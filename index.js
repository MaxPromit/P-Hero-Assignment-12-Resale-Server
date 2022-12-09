const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 4000;
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

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
        const wishlistCollection = client.db('resale-Bike').collection('wishlist');
        const paymentCollection = client.db('resale-Bike').collection('payments')
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
        // is admin 
        app.get('/users/admin/:email', async(req,res)=>{
            const email = req.params.email;
            const query = {email}
            const user = await usersCollection.findOne(query);
            res.send({isAdmin : user?.role === 'Admin'})
        })
        app.get('/users/seller/:email', async(req,res)=>{
            const email = req.params.email;
            const query = {email}
            const user = await usersCollection.findOne(query);
            res.send({isSeller : user?.role === 'Seller'})
        })
        app.get('/users/buyer/:email', async(req,res)=>{
            const email = req.params.email;
            const query = {email}
            const user = await usersCollection.findOne(query);
            res.send({isBuyer : user?.role === 'Buyer'})
        })

        // all sellers
        app.get('/allsellers', async(req,res)=>{
            const query = {role: 'Seller'}
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })
          // seller delete
          app.delete('/sellerdelete/:id', async (req,res)=>{
            const id = req.params.id;
            console.log(id)
            const filter = {_id: ObjectId(id)}
            const result = await usersCollection.deleteOne(filter)
            res.send(result)
        })
        // verify seller

        app.put('/sellerverify/:email', async(req,res)=>{
            const email = req.params.email;
            console.log(email);
            const filter = {email: email};
            const option = {upsert: true}
            const updateDoc = {
                $set: {
                    sellerStatus: 'Verified'
                }
            }
            const result = await catagoriesProductCollection.updateMany(filter,updateDoc,option)
            const result2 = await usersCollection.updateOne(filter,updateDoc,option)
            res.send(result)
        })


        // allbuyers
        app.get('/allbuyers', async(req,res)=>{
            const query = {role: 'Buyer'}
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })
        app.delete('/buyerdelete/:id', async (req,res)=>{
            const id = req.params.id;
            console.log(id)
            const filter = {_id: ObjectId(id)}
            const result = await usersCollection.deleteOne(filter)
            res.send(result)
        })

        // wishlist

        app.get('/wishlist/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await catagoriesProductCollection.find(query).toArray()
            res.send(result)
        })
        app.post('/wishlist', async(req,res)=>{
            const info = req.body;
            const query = {info};
            const result = await wishlistCollection.insertOne(query);
            res.send(result)
            
        })
        app.get('/allwishlist',async(req,res)=>{
            const query= {};
            const result = await wishlistCollection.find(query).toArray()
            res.send(result)
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
        // my product section 

        app.get('/myproducts', async(req,res)=>{
            const email = req.query.email;
            const query = {email}
            const result = await catagoriesProductCollection.find(query).toArray();
            res.send(result)
        })

        app.delete('/myproducts/:id', async (req,res)=>{
            const id = req.params.id;
            console.log(id)
            const filter = {_id: ObjectId(id)}
            const result = await catagoriesProductCollection.deleteOne(filter)
            res.send(result)
        })
      
        
        // modal bookings
        app.post('/bookings', async(req,res)=>{
            const bookings = req.body;
            // console.log(bookings);
            const result = await bookingsCollection.insertOne(bookings)
            res.send(result)
        })
        app.put('/productStatusUpdate/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const option = {upsert: true}
            const updateDoc = {
                $set: {
                    status: 'Sold'
                }
            }
            const result = await catagoriesProductCollection.updateOne(filter,updateDoc,option)
            res.send(result)
        })

        // Payment
        app.get('/allbookings', async(req,res)=>{
            const query = {};
            const result = await bookingsCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/bookings/:id', async(req,res)=>{
            const id = req.params.id;
            console.log('bok',id)
            const query = {_id: ObjectId(id)};
            const bookings = await bookingsCollection.findOne(query);
            res.send(bookings)
        })

        app.post('/create-payment-intent', async(req,res)=>{
            const booking = req.body;
            const price = booking.price;
            const amount = parseInt(price * 100);

            const paymentIntent = await stripe.paymentIntents.create({
                currency: 'usd',
                amount: amount,
                "payment_method_types": [
                    "card"
                ]
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            })
        })

        app.post('/payments', async(req,res)=>{
            const payment = req.body;
            const result = await paymentCollection.insertOne(payment);
            const id = payment.bookingId
            const filter = {_id: ObjectId(id)}
            const updatedDoc = {
                $set:{
                    paid: true,
                    transactionId: payment.transactionId
                }
            }
            const updatedResult = await bookingsCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })


        // advirtised
        app.put('/advirtised/:id', async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const option = {upsert: true}
            const updateDoc = {
                $set: {
                    advertised: 'True'
                }
            }
            const result = await catagoriesProductCollection.updateOne(filter,updateDoc,option)
            res.send(result)
        })
        app.get('/advirtisedtrue', async(req,res)=>{
            const query = {advertised: 'True'};
            const result = await catagoriesProductCollection.find(query).toArray()
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

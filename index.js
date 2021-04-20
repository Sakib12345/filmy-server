const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const port = 5000;

const userName = process.env.DB_USER;
const pass = process.env.DB_PASS;
const dbName = process.env.DB_Name;

const uri = `mongodb+srv://${userName}:${pass}@cluster0.k1ugo.mongodb.net/${dbName}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db(`${dbName}`).collection("services");
    const bookingsCollection = client.db(`${dbName}`).collection("bookings");
    const reviewsCollection = client.db(`${dbName}`).collection("reviews");
    const adminCollection = client.db(`${dbName}`).collection("admin");
    // app.post('/addServices', (req, res) => {
    //     const services = req.body
    //     serviceCollection.insertMany(services, (err, result)=>{
    //         res.send(result);
    //     })
        
    // })

    app.get('/services', (req, res) => {
        serviceCollection.find({})
        .toArray((err, documents)=>{
            res.send(documents);
        })
    })

    app.get('/services/:id', (req, res)=>{
        const id = req.params.id;
        serviceCollection.find({_id: ObjectId(id)})
        .toArray((err, documents)=>
        {
            res.send(documents[0])
        })
    })

     app.post('/addBooking', (req, res) => {
        const booking = req.body
        bookingsCollection.insertOne(booking, (err, result)=>{
            res.send(result);
        })
        
    });
    app.get('/bookings', (req,res)=>{
        bookingsCollection.find({email: req.query.email})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    });
    

    app.post('/addReview', (req, res) => {
        const review = req.body
        reviewsCollection.insertOne(review, (err, result)=>{
            res.send(result);
        })
    });
    
    app.get('/reviews', (req, res)=>{
        reviewsCollection.find({})
        .toArray((err, documents)=>{
            res.send(documents);
        })
    });
    app.get('/orderList', (req, res)=>{
        bookingsCollection.find({})
        .toArray((err, documents)=>{
            res.send(documents);
        })
    });

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    });
    //makeAdmin
    app.post('/makeAdmin', (req, res) => {
        const email = req.body;
        adminCollection.insertOne(email, (err, result)=>{
            res.send(result);
        })
    });
    app.delete('/deleteService/:id', (req, res)=>{
        const id = req.params.id;
        serviceCollection.deleteOne({_id: ObjectId(id)}, (err, result)=>{
            if(!err){
                res.send({count: 1})
            }
        })
    });
    //add a new service
    app.post('/addService', (req, res)=>{
        const service = req.body
        serviceCollection.insertOne(service, (err,result) => {
            res.send({count: result.insertedCount});
        })
    })

});






app.get('/', (req, res) => {
    res.send('welcome');
})

app.listen(process.env.PORT || port);
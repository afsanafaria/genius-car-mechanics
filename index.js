const express = require('express');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// user: geniusCarServer
// pass: 00NQRAzjgv2tzJLW


// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1isfb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("CarMechanic");
        const servicesCollection = database.collection("services");
        //get all api

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const resultInArray = await cursor.toArray();
            console.log(`Got`, resultInArray);
            res.send(resultInArray)
        })

        //get one api

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            console.log(`one id got`, service);
            res.send(service)
        })

        //post api 
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log(`posted`, result);
            res.json(result)
        })

        //delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.deleteOne(query);
            console.log(`Deleeted`, service);
            res.json(service)
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('car car car')
})

app.listen(port, () => {
    console.log("car ashche from", port);
})
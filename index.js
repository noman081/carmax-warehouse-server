const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kwo2m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const carCollection = client.db('carMax').collection('cars');
        app.get('/', (req, res) => {
            res.send('CarMax server is running agun..............');
        })

        app.get('/cars', async (req, res) => {
            const email = req.query.email;
            const customQuery = req.query.home;
            let query;
            let cars;
            let cursor;
            if (email) {
                query = {
                    email: email
                };
                cursor = carCollection.find(query);
                cars = await cursor.toArray();
                console.log('query-', query);
                res.send(cars);
            }
            else {
                query = {};
                cursor = carCollection.find(query);
                if (customQuery) {
                    cars = await cursor.limit(6).toArray();
                }
                else {
                    cars = await cursor.toArray();
                }
                res.send(cars);
            }
        });

        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const car = await carCollection.findOne(query);
            res.send(car);

        });
        app.delete('/car/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await carCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/cars', async (req, res) => {
            const car = req.body;
            console.log(car);
            const result = await carCollection.insertOne(car);
            res.send(result);
        });

        //update quantity
        app.put('/car/:id', async (req, res) => {
            const id = req.params.id;
            const prevQuantity = parseInt(req.query.quantity);
            const addedQuantity = parseInt(req.query.add);
            let updatedQuantity;
            if (addedQuantity) {
                updatedQuantity = prevQuantity + addedQuantity;
            }
            else {
                updatedQuantity = prevQuantity - 1;
            }
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity
                }
            };
            const result = await carCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })


    }
    finally {

    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log('CarMax server is running at port: ', port);
})
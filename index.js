const { MongoClient, ServerApiVersion } = require('mongodb');
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
            const query = {};
            const cursor = carCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars);
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log('CarMax server is running at port: ', port);
})
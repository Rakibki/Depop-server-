const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3001
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();

app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://Depop:zdGNxQf7FZNnsKLN@cluster0.sinogwr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const database = client.db("Depop");
    const products = database.collection("products");
    const cards = database.collection("cards");


    app.get("/products", async(req, res) => {
      const result = await products.find().toArray();
      res?.send(result)
    })

    app.post("/card", async(req, res) => {
      const product = req.body;    
      const result = await cards.insertOne(product);
      res.send(result)
    })


    app.get("/cardLength/:email", async (req, res) => {
      const email = req?.params?.email;
      const filter = {email: email}
      const count = await cards.countDocuments(filter)
      res.send({count});
    })


    app.get("/myCard/:email", async (req, res) => {
      const email = req.params?.email;
      const filter = {email: email}
      const result = await cards.find(filter).toArray();
      res.send(result)
    })

    app.delete("/myCard/:id", async (req, res) => {
      const id = req.params.id
      const filter = {_id: id}
      const result = await cards.deleteOne(filter)
      res.send(result)
    })


    app.get("/product/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await products.findOne(filter)
      res.send(result)
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("server is running")
})

app.listen(port, () => {
    console.log(`server is running at ${port}`);
})
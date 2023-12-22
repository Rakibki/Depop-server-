const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3001
const { MongoClient, ServerApiVersion } = require('mongodb');


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

    app.get("/products", async(req, res) => {
      const result = await products.find().toArray();
      res?.send(result)
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
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
    await client.connect();

    const database = client.db("JobTrack");

    console.log("Connected to JobTrack database!");

    return database;
}

module.exports = connectDB;
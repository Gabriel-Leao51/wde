const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const uri = process.env.MONGODB_URI;

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect(uri);
  database = client.db("online-shop");
}

function getDb() {
  if (!database) {
    throw new Error("You must connect first!");
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};

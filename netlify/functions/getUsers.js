const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function() {
  try {
    await client.connect();
    const db = client.db('mydatabase');
    const collection = db.collection('messages');
    const messages = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return { statusCode: 200, body: JSON.stringify(messages) };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  } finally {
    await client.close();
  }
};

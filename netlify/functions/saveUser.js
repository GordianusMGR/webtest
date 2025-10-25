const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const { name, message } = JSON.parse(event.body);
  if (!name || !message) return { statusCode: 400, body: 'Missing fields' };

  try {
    await client.connect();
    const db = client.db('mydatabase');
    const collection = db.collection('messages');
    const result = await collection.insertOne({ name, message, createdAt: new Date() });
    return { statusCode: 200, body: JSON.stringify({ data: { _id: result.insertedId, name, message } }) };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  } finally {
    await client.close();
  }
};

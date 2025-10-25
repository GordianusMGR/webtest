const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function(event) {
  if (event.httpMethod !== 'DELETE') return { statusCode: 405, body: 'Method Not Allowed' };

  const id = event.queryStringParameters?.id;
  if (!id) return { statusCode: 400, body: 'Missing id' };

  try {
    await client.connect();
    const db = client.db('mydatabase');
    const collection = db.collection('messages');
    await collection.deleteOne({ _id: new ObjectId(id) });
    return { statusCode: 200, body: JSON.stringify({ message: 'Deleted successfully', id }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  } finally {
    await client.close();
  }
};

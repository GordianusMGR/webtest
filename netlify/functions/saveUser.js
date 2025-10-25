import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "userFormDB";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, message } = JSON.parse(event.body);
    if (!name || !message) {
      return { statusCode: 400, body: "Missing name or message" };
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("messages");

    await collection.insertOne({ name, message, createdAt: new Date() });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Saved successfully!" }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Server error" };
  } finally {
    await client.close();
  }
};

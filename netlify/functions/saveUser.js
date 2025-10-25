import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "userMessagesDB";

export const handler = async (event) => {
  console.log("Function triggered!");

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, message } = JSON.parse(event.body);
    console.log("Received data:", name, message);

    if (!name || !message) {
      return { statusCode: 400, body: "Missing name or message" };
    }

    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db(dbName);
    const collection = db.collection("messages");

    await collection.insertOne({ name, message, createdAt: new Date() });
    await client.close();

    console.log("Data inserted successfully!");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved successfully!" }),
    };
  } catch (error) {
    console.error("Error:", error.message);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

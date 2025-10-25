import { MongoClient } from "mongodb";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI not set in environment variables");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server misconfiguration" }),
    };
  }

  try {
    const { name, message } = JSON.parse(event.body);

    if (!name || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing name or message" }),
      };
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("userMessagesDB");
    const collection = db.collection("messages");

    await collection.insertOne({ name, message, createdAt: new Date() });

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved successfully!" }),
    };
  } catch (error) {
    console.error("Error in saveUser function:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message || "Server error" }),
    };
  }
};

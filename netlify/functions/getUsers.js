import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "userMessagesDB";

export const handler = async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection("messages");

    const messages = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    await client.close();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching messages" }),
    };
  }
};

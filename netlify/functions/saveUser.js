import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // stored securely in Netlify
const client = new MongoClient(uri);
const dbName = "userMessagesDB";

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
    const messages = db.collection("messages");

    await messages.insertOne({
      name,
      message,
      createdAt: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message saved successfully!" }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Error saving message" };
  } finally {
    await client.close();
  }
};

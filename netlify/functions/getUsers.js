import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "userFormDB";

export const handler = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("messages");
    const data = await collection.find().sort({ createdAt: -1 }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Error fetching messages" };
  } finally {
    await client.close();
  }
};

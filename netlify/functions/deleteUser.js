import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "userMessagesDB";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { id } = JSON.parse(event.body);
    if (!id) return { statusCode: 400, body: "Missing ID" };

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection("messages");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: result.deletedCount ? "Message deleted" : "Message not found",
      }),
    };
  } catch (error) {
    console.error("Error deleting message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error deleting message" }),
    };
  }
};

// pages/api/user/getSelectedTopics.ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions); // Get the user's session

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  await dbConnect(); // Connect to the database

  try {
    // Find the user by their email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user);

    // Extract the categories from the selectedTopics field
    const selectedTopics = user.selectedTopics.map(topic => topic.category);

    // Return the array of selected topics as categories
    return res.status(200).json({ selectedTopics });
  } catch (error) {
    console.error("Error fetching selected topics:", error);
    return res.status(500).json({ error: "Failed to fetch selected topics" });
  }
}

// pages/api/user/updateSelectedTopicsDashboard.ts
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

  const { category, lastResource } = req.body;
  console.log("Category:", category);
  console.log("LastResource:", lastResource);

  if (!category || !lastResource) {
    return res.status(400).json({ error: "Invalid input" });
  }

  await dbConnect(); // Connect to the database

  try {
    // Find the user by their email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the index of the category to update in selectedTopics
    const categoryIndex = user.selectedTopics.findIndex(
      (topic) => topic.category === category
    );

    if (categoryIndex === -1) {
      return res.status(400).json({ error: "Category not found" });
    }

    // Update only the `lastResource` for the matched category
    user.selectedTopics[categoryIndex].lastResource = lastResource;

    // Save the updated user document
    await user.save();

    return res.status(200).json({ message: "Topic updated successfully", user });
  } catch (error) {
    console.error("Error updating topics:", error);
    return res.status(500).json({ error: "Failed to update topics" });
  }
}

// pages/api/user/updateSelectedTopics.ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions); // Get the user's session
  console.log("session", session);
  
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { selectedTopics } = req.body;
  console.log("selectedTopics", selectedTopics);

  if (!selectedTopics || !Array.isArray(selectedTopics)) {
    return res.status(400).json({ error: "Invalid selected topics" });
  }

  await dbConnect(); // Connect to the database

  // Map selectedTopics strings to the expected object structure
  const formattedTopics = selectedTopics.map(topic => ({
    category: topic,
    lastResource: { topic: "", subtopic: "", resource: "" } // Empty lastResource as default
  }));

  // Set the last selected category as the `lastCategory`
  const lastCategory = selectedTopics[0] || ""; // Get the first selected category or set as empty string if none

  try {
    // Find the user by their email and update the selectedTopics and lastCategory
    const user = await User.findOneAndUpdate(
      { email: session.user.email }, // Find the user by email
      { 
        $set: { 
          selectedTopics: formattedTopics, // Update with formatted topics
          lastCategory: lastCategory        // Set the lastCategory to the last topic selected
        }
      },
      { new: true, upsert: true } // Return the updated document, create if not found
    );

    console.log("user", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "Topics and last category updated successfully", user });
  } catch (error) {
    console.error("Error updating topics and last category:", error);
    return res.status(500).json({ error: "Failed to update topics and last category" });
  }
}

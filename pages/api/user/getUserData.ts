// pages/api/user/getUserData.ts
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

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch user" });
  }
}

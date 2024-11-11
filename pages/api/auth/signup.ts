import { hash } from "bcryptjs"; // For hashing passwords
import dbConnect from "@/lib/dbConnect"; // Your database connection logic
import User from "@/models/User"; // Your User model
import type { NextApiRequest, NextApiResponse } from "next"; // Import Next.js types

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Validate input (e.g., check for existing user)
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    try {
      await dbConnect(); // Connect to your database

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Create a new user in the database
      const newUser = await User.create({ email, password});

      return res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Error creating user." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

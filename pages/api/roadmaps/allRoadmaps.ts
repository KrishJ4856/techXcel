// pages/api/roadmaps.ts

import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from "@/lib/dbConnect"; // Adjust the import according to your structure
import AvailableRoadmap from "@/models/AvailableRoadmap"; // Adjust the model import according to your structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Ensure the database is connected

  try {
    const roadmaps = await AvailableRoadmap.find(); // Fetch all available roadmaps
    console.log("Roadmaps: ", roadmaps);
    res.status(200).json(roadmaps); // Send the roadmaps as JSON
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    res.status(500).json({ error: "Failed to fetch roadmaps" });
  }
}

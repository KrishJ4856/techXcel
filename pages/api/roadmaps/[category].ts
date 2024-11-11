// pages/api/roadmaps/[category].ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Roadmap from "@/models/Roadmap"; // Your model can remain the same

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { category } = req.query; // e.g., "JavaScript", "React", etc.

  try {
    // Adjust the query to look inside the `roadmap` field
    const roadmap = await Roadmap.findOne({ "roadmap.category": new RegExp(category as string, "i") });

    if (!roadmap) {
      return res.status(404).json({ success: false, message: "Roadmap not found" });
    }

    // Return the nested roadmap data
    res.status(200).json({ success: true, data: roadmap });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
}

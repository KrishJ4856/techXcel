// /pages/api/user/updateLastCategory.js
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await dbConnect();
    
    const session = await getServerSession(req, res, authOptions); // Get the user's session
    console.log("YES:", session)
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { selectedTopic } = req.body;
    console.log("YES:", selectedTopic)

    try {
      console.log("YES: UPDATING THE USER");
      
      const updatedUser = await User.findOneAndUpdate(
        { email: session.user.email },
        { lastCategory: selectedTopic },
        { new: true }
      );
      console.log("YES: Last category updated")
      res.status(200).json({ message: 'Last category updated', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error updating last category', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

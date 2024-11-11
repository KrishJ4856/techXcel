// pages/api/parseTitle.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const response = await fetch(url as string);
    const text = await response.text();

    // Extract the title from HTML
    const titleMatch = text.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "Untitled";

    res.status(200).json({ title });
  } catch (error) {
    console.error("Error parsing title:", error);
    res.status(500).json({ error: "Failed to fetch title" });
  }
}

// ResourceCard.tsx
import { useEffect, useState } from "react";

// Utility to determine if a URL is a YouTube link and get the ID
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Main component
export default function ResourceCard({ url }: { url: string }) {
  const [title, setTitle] = useState<string | null>(null);
  const [type, setType] = useState<"youtube" | "website">("website");

  useEffect(() => {
    const fetchTitle = async () => {
      const youtubeId = getYouTubeVideoId(url);
      if (youtubeId) {
        // Use YouTube's oEmbed API to fetch the title
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`);
        const data = await res.json();
        setTitle(data.title);
        setType("youtube");
      } else {
        // For other websites, fetch HTML and parse the title
        try {
          const res = await fetch(`/api/parseTitle?url=${encodeURIComponent(url)}`);
          const data = await res.json();
          setTitle(data.title);
        } catch (error) {
          console.error("Error fetching title:", error);
          setTitle("Preview unavailable");
        }
      }
    };

    fetchTitle();
  }, [url]);

  return (
    <div className="resource-card flex flex-col items-center p-4 border rounded-lg shadow-md bg-gray-800 text-white">
      <div className="icon mb-2">
        {type === "youtube" ? (
          <img src="/icons/youtube-logo.png" alt="YouTube" className="h-6 w-6" />
        ) : (
          <img src="/icons/link-icon.png" alt="Website" className="h-6 w-6" />
        )}
      </div>
      <p className="title text-center">{title || "Loading..."}</p>
    </div>
  );
}

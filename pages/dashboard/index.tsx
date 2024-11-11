import CustomAvatar from "@/components/avatar";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ThemeSwitch } from "@/components/theme-switch";
import { SidebarWrapper } from "@/components/sidebar/sidebar";
import { NavbarWrapper } from "@/components/navbar/navbar";
import Microlink from '@microlink/react'
import { useRouter } from "next/router";
import { BurguerButton } from "@/components/navbar/burguer-button";
import { UserDropdown } from "@/components/navbar/user-dropdown";

function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function ResourcePreview({ url }: { url: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const youtubeVideoId = getYouTubeVideoId(url);
        if (youtubeVideoId) {
          setImageUrl(`https://img.youtube.com/vi/${youtubeVideoId}/0.jpg`);
        } else {
          const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true`)
          const data = await response.json()
          if (data.status === 'success') {
            setImageUrl(data.data.screenshot.url)
          } else {
            setError(true)
          }
        }
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [url])

  if (loading) {
    return <h1>Loading</h1>
  }

  if (error) {
    return <div className="w-full h-32 bg-gray-700 flex items-center justify-center text-gray-400">Preview unavailable</div>
  }

  return (
    <div className="w-full h-32 bg-gray-700 overflow-hidden">
      <img src={imageUrl || ''} alt="Website preview" className="w-full h-full object-cover" />
    </div>
  )
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  // console.log("Session info: ", session)
  // Session info: session.user.email/name/image

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // selected shall contain an object with topic, subtopic and resources (array) properties
  const [userData, setUserData] = useState(null);

  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility

  const router = useRouter()

  // Effect to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/getUserData");
        const data = await res.json();

        if (data.success) {
          setUserData(data.data);
        } else {
          console.error("Error fetching user data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Effect to fetch roadmap after userData is available
  useEffect(() => {
    const fetchRoadmap = async () => {
      if (userData) {
        const lastCategory = userData.lastCategory !== "" ? userData.lastCategory : userData.selectedTopics[0].category;
        console.log("Last category: ", lastCategory);

        if (lastCategory) {
          const res = await fetch(`/api/roadmaps/${lastCategory}`);
          const data = await res.json();

          if (data && data.data && data.data.roadmap) {
            setRoadmap(data.data.roadmap); // Make sure roadmap is fetched correctly
          } else {
            console.error("Error fetching roadmap:", data.error);
          }
        } else {
          router.push("/topic");
        }
      }
    };

    fetchRoadmap();
  }, [userData]);

  // Effect to set selected once roadmap is available
  useEffect(() => {
    if (roadmap && userData) {
      console.log("User data: ", userData);
      console.log("Roadmap: ", roadmap);

      const lastCategory = userData.lastCategory !== "" ? userData.lastCategory : userData.selectedTopics[0].category;
      console.log("Last category: ", lastCategory);

      const lastCategoryIndex = userData.selectedTopics.findIndex(topic => topic.category === lastCategory);
      console.log("Last category index: ", lastCategoryIndex);

      const lastTopic = userData.selectedTopics[lastCategoryIndex].lastResource.topic;
      console.log("Last topic: ", lastTopic);

      const lastSubtopic = userData.selectedTopics[lastCategoryIndex].lastResource.subtopic;
      console.log("Last subtopic: ", lastSubtopic);
      const lastResource = userData.selectedTopics[lastCategoryIndex].lastResource.resource;
      console.log("Last resource: ", lastResource);

      if (lastCategory && lastTopic && lastSubtopic && lastResource) {
        const lastTopicIndex = roadmap.topics.findIndex(topic => topic.topic === lastTopic);
        console.log("Last topic index: ", lastTopicIndex);

        const lastSubtopicIndex = roadmap.topics[lastTopicIndex].subtopics.findIndex(subtopic => subtopic.subtopic === lastSubtopic);
        console.log("Last subtopic index: ", lastSubtopicIndex);

        setSelected({
          category: lastCategory,
          lastResource: {
            topic: lastTopic,
            subtopic: lastSubtopic,
            resource: lastResource,
          },
          resources: roadmap.topics[lastTopicIndex].subtopics[lastSubtopicIndex].resources
        });
      } else {
        setSelected({
          category: lastCategory,
          lastResource: {
            topic: lastTopic,
            subtopic: lastSubtopic,
            resource: lastResource,
          },
          resources: []
        });
      }
    }
  }, [roadmap, userData]);

  // Effect to update selected topics in the backend
  useEffect(() => {
    const updateSelectedTopics = async () => {
      if (selected) {
        const selectedCopy = { ...selected };
        delete selectedCopy.resources;

        const res = await fetch("/api/user/updateSelectedTopicsDashboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedCopy),
        });

        const data = await res.json();
        console.log("Selected topics updated: ", data.message);
        console.log("Updated user data: ", data.user);
      }
    };
    updateSelectedTopics();
  }, [selected]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar's open state
  };

  // Utility function for fetching the title of a website or YouTube video
  async function fetchResourceDetails(url: string): Promise<{ title: string; type: "youtube" | "link" }> {
    const youtubeVideoId = getYouTubeVideoId(url);
    if (youtubeVideoId) {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${youtubeVideoId}&part=snippet&key=YOUR_YOUTUBE_API_KEY`);
      const data = await response.json();
      return {
        title: data.items[0].snippet.title,
        type: "youtube",
      };
    } else {
      const response = await fetch(url);
      const html = await response.text();
      const title = html.match(/<title>(.*?)<\/title>/)?.[1] || "Unknown title";
      return { title, type: "link" };
    }
  }

  // Custom component to preview resources with icons
  function ResourcePreview({ url }: { url: string }) {
    const [resourceDetails, setResourceDetails] = useState<{ title: string; type: "youtube" | "link" } | null>(null);

    useEffect(() => {
      const fetchDetails = async () => {
        const details = await fetchResourceDetails(url);
        setResourceDetails(details);
      };
      fetchDetails();
    }, [url]);

    if (!resourceDetails) return <div>Loading...</div>;

    return (
      <div className="flex items-center p-4 bg-gray-700 rounded-lg shadow-md w-[500px]">
        <div className="mr-4">
          {resourceDetails.type === "youtube" ? (
            <img src="/path-to-youtube-logo.png" alt="YouTube" className="h-8 w-8" />
          ) : (
            <img src="/path-to-link-icon.png" alt="Link" className="h-8 w-8" />
          )}
        </div>
        <div>
          <h4 className="text-white text-lg font-semibold">{resourceDetails.title}</h4>
        </div>
      </div>
    );
  }

  return (
    (loading || roadmap === null)
      ? <div>Loading...</div>
      : (
        <div className="flex">
          <SidebarWrapper roadmap={roadmap} setRoadmap={setRoadmap} setUserData={setUserData} setSelected={setSelected} isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-1 h-full p-4">
            <div className="flex justify-end items-center p-[10px] gap-[20px]">
              <ThemeSwitch/>
              <UserDropdown/>
            </div>
            <div className="p-4 mt-10">
              {(selected === null || selected.lastResource.topic === "") ? (
                <p>Learning {roadmap.category}</p>
              ) : (
                <>
                  {isOpen === false ? (
                    <div onClick={toggleSidebar} className="px-[5px] rounded md:hidden mb-[40px] z-[0]">
                      <BurguerButton />
                    </div>
                  ) : null}
                  <h2 className={title({ class: "text-3xl lg:text-4xl block" })}>Chapter: {selected.lastResource.topic}</h2>
                  <h2 className={title({ class: "text-2xl lg:text-3xl mt-4" })}>Topic: {selected.lastResource.subtopic}</h2>
                  <h3 className="text-lg lg:text-2xl mt-4 mb-4">Resources:</h3>
                  <div className="flex flex-wrap gap-[30px]">
                    {selected.resources.map((res, index) => {
                      return (
                        <Microlink
                          url={res}
                          media={["image", "logo"]}
                          size="large"
                          key={index}
                          className="w-[500px] rounded-[20px]"
                        />
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )
  );
}



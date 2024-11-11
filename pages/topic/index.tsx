import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/router";

export default function SelectTopicPage() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [availableRoadmaps, setAvailableRoadmaps] = useState({ skill: [], role: [] });
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleAddTopic = (topic: string) => {
    setSelectedTopics((prevTopics) =>
      prevTopics.includes(topic) ? prevTopics : [...prevTopics, topic]
    );
  };

  const handleRemoveTopic = (topic: string) => {
    setSelectedTopics((prevTopics) => prevTopics.filter((t) => t !== topic));
  };

  const handleSaveTopics = async() => {
    if (selectedTopics.length === 0) {
      setError(true);
      return;
    } else {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user/updateSelectedTopics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedTopics }),
        });

        const data = await response.json();
        setIsLoading(false);
        if (response.ok) {
          alert("Topics saved successfully");
          console.log("Topics saved successfully:", data);
          router.push("/dashboard");
        } else {
          alert("Error saving topics");
          console.error("Error saving topics:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

  };

  useEffect(() => {
    // Fetch available roadmaps from the API
    const fetchAvailableRoadmaps = async () => {
      try {
        const response = await fetch("/api/roadmaps/allRoadmaps");
        const data = await response.json();
        console.log("Data: ", data);
        setAvailableRoadmaps(data[0].roadmaps); // Assuming data returns an array with the roadmaps object
      } catch (error) {
        console.error("Error fetching available roadmaps:", error);
      }
    };

    fetchAvailableRoadmaps();
  }, []);

  useEffect(() => {
    const fetchSelectedTopics = async () => {
      try {
        const response = await fetch("/api/user/getSelectedTopics");
        const data = await response.json();
        setSelectedTopics(data.selectedTopics);
      } catch (error) {
        console.error("Error fetching selected topics:", error);
      }
    };

    fetchSelectedTopics();
  }, []);

  useEffect(() => {
    if (selectedTopics.length > 0) {
      setError(false);
    }
  }, [selectedTopics]);

  useEffect(() => {
    console.log(availableRoadmaps);
  }, [availableRoadmaps]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-baseline justify-center gap-4 py-8 md:py-1">
        <div className="inline-block w-full justify-center">
          <div className="flex justify-between">
            <h2 className={title({ class: "text-3xl lg:text-4xl" })}>Your Topics:</h2>
            <Button size="md" color="primary" className="w-[100px]" onClick={handleSaveTopics} isLoading={isLoading}>Save</Button>
          </div>
          {error && <p className="text-red-500 mt-2 mb-4">{error}</p>}
          <div className="mb-[30px]">
            {selectedTopics.length === 0 ? (
              <p className={`mt-2 mb-4 ${error ? "text-red-500" : "text-gray-500"}`}>Please add at least one topic to continue</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-[20px]">
                {selectedTopics.map((topic) => (
                  <Card className="cursor-pointer" key={topic}>
                    <CardBody onClick={() => handleRemoveTopic(topic)} className="flex flex-col items-center">
                      <p>{topic}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <h2 className={title({ class: "text-3xl lg:text-4xl" })}>Available Roadmaps:</h2>
          <br />
          <br />
          <h3 className={title({ class: "text-xl lg:text-2xl" })}>Skill Based Roadmaps:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-[20px]">
            {availableRoadmaps?.skill?.map((skill) => (
              <Card className="cursor-pointer" key={skill}>
                <CardBody className="flex flex-col items-center" onClick={() => handleAddTopic(skill)}>
                  <p>{skill}</p>
                </CardBody>
              </Card>
            ))}
          </div>
          <br />
          <h3 className={title({ class: "text-xl lg:text-2xl" })}>Role Based Roadmaps:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-[20px]">
            {availableRoadmaps?.role?.map((role) => (
              <Card className="cursor-pointer" key={role}>
                <CardBody className="flex flex-col items-center" onClick={() => handleAddTopic(role)}>
                  <p>{role}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}

'use client'

import { useState, useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection, Button } from "@nextui-org/react";
import axios from "axios";

export const RoadmapTopic = ({ topic, setRoadmap, setUserData }) => {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

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

    const handleAction = async (key: React.Key) => {
        const selectedTopic = selectedTopics[Number(key)];
        console.log(selectedTopic)
        if (selectedTopic) {
            try {
                // fetching the new roadmap from db
                const res = await fetch(`/api/roadmaps/${selectedTopic}`);
                const data = await res.json();

                // update last category property of the user
                const res1 = await fetch("/api/user/updateLastCategory", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({selectedTopic}),
                });

                // update the userData using setUserData before updating roadmap
                const res2 = await fetch("/api/user/getUserData");
                const data2 = await res2.json();
                setUserData(data2.data)

                // now, call setRoadmap() to update roadmap
                if (data && data.data && data.data.roadmap) {
                    setRoadmap(data.data.roadmap); // Make sure roadmap is fetched correctly
                } else {
                    console.error("Error fetching roadmap:", data.error);
                }
            } catch (error) {
                console.error('Failed to update last category:', error);
            }
        }
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="bordered">
                    Learning {topic}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Dynamic Actions"
                onAction={handleAction}
            >
                <DropdownSection title="Selected Topics">
                    {selectedTopics.map((topic, index) => (
                        <DropdownItem key={index}>{topic}</DropdownItem>
                    ))}
                </DropdownSection>
                <DropdownSection title="Actions">
                    <DropdownItem key='all_topics' href="/topic">Add another roadmap</DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
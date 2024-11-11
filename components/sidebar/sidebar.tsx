import React, { useEffect } from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { usePathname } from "next/navigation";
import { BurguerButton } from "../navbar/burguer-button";
import { RoadmapTopic } from "./roadmap-topic";

function getSubtopicsArray(subtopics) {
  const subtopicsArr: any[] = []
  subtopics.forEach(sub => {
    subtopicsArr.push({ subtopic: sub.subtopic, resources: sub.resources })
  })
  return subtopicsArr
}

export const SidebarWrapper = ({ roadmap, setRoadmap, setUserData, setSelected, isOpen, toggleSidebar }: any) => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  console.log("here:", roadmap)
  useEffect(()=>console.log("here:", roadmap), [roadmap])
  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={`bg-background transition-transform h-full fixed w-80 shrink-0 z-[202] overflow-y-auto border-r border-divider flex-col py-6 px-3 md:translate-x-0 md:flex md:static md:h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div onClick={toggleSidebar} className="px-[10px] rounded md:hidden mb-[40px]">
          <BurguerButton/>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-6 mt-2 px-2">
            <RoadmapTopic topic={roadmap.category} setRoadmap={setRoadmap} setUserData={setUserData}/>
            <SidebarMenu title="Chapters">
              {
                roadmap?.topics?.map((topic, index) => {
                  return <CollapseItems
                    items={getSubtopicsArray(topic.subtopics)}
                    title={topic.topic}
                    topic={topic.topic}
                    key={index}
                    category={roadmap.category}
                    setSelected={setSelected}
                  />
                })
              }
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useRouter } from "next/navigation";
import { UserIcon } from "../icons";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { CollapseItemsNav } from "./collapse-items";
// import { deleteAuthCookie } from "@/actions/auth.action";

export const UserDropdown = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // const handleLogout = useCallback(async () => {
  //   await deleteAuthCookie();
  //   router.replace("/login");
  // }, [router]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="cursor-pointer rounded-[100%] p-[5px] flex justify-center items-center border-[2px] border-solid border-violet-500">
          <UserIcon />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='User menu actions'
        onAction={(actionKey) => console.log({ actionKey })}>
        <DropdownItem
          key='profile'
          className='flex flex-col justify-start w-full items-start'>
          <p>Signed in as</p>
          <p>{session?.user?.email}</p>
        </DropdownItem>
        <DropdownItem key='all_topics' href="/topic">All Topics</DropdownItem>
        <DropdownItem key='help_and_feedback' href="/feedback">Help & Feedback</DropdownItem>
        <DropdownItem
          key='logout'
          color='danger'
          className='text-danger'
          onPress={() => signOut({ callbackUrl: "/" })}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

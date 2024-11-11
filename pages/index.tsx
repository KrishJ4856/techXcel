import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { LaptopMockup } from "@/components/laptop-mockup";
import { Button } from "@nextui-org/button";
import { useSession } from "next-auth/react";

export default function IndexPage() {
  const { data: session, status } = useSession();
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl flex flex-col text-center justify-center items-center">
          <div>
            <span className={title({ color: "violet" })}>Focused&nbsp;</span>
            <span className={title()}>platform to learn&nbsp;</span>
            <br />
            <span className={title({ color: "cyan" })}>new tech skills&nbsp;</span>
            <span className={title()}>with&nbsp;</span>
            <br />
            <span className={title({ color: "yellow" })}>guided roadmaps&nbsp;</span>
          </div>
          <div className={subtitle({ class: "mt-4" })}>
            Break the cycle of procrastination! Stay on track, all the way to the finish line.
          </div>
        </div>
      </section>
      <LaptopMockup />
      {/* Quote */}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 mt-[100px]">
        <div className="inline-block max-w-2xl text-center justify-center">
          <div className="inline-block max-w-2xl flex flex-col text-center justify-center items-center">
            <div>
              <span className={title()}>Feeling&nbsp;</span>
              <span className={title({ color: "pink" })}>overwhelmed&nbsp;</span>
              <span className={title()}>and&nbsp;</span>
              <span className={title({ color: "green" })}>confused?&nbsp;</span>
            </div>
            <div className={subtitle({ class: "mt-4" })}>
              With techXcel, access high quality resources, just enough in number to help you achieve tech mastery!
            </div>
          </div>
        </div>
      </section>
      {/* Logos */}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 mt-[50px]">
        <div className="inline-block max-w-4xl text-center justify-center border-[4px] border-solid border-violet-500 rounded-[10px] px-[100px] py-[50px]">
          <div className="inline-block max-w-2xl flex flex-col text-center justify-center items-center">
            <div>
              <span className={title()}>Start your coding journey with&nbsp;</span>
              <span className={title({ color: "violet" })}>techXcel&nbsp;</span>
              <span className={title()}>today!&nbsp;</span>
              <br />
              <Button
                isExternal
                as={Link}
                className="text-md font-normal mt-[20px] w-[60%]"
                href={session?.user ? "/dashboard" : "/auth/login"}
                variant="solid"
                size="lg"
                // color="secondary"
              >
                {session?.user ? "Go to Dashboard" : "Start Learning"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}

import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";

import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const servers = await db.server.findMany({ where: { members: { some: { profileId: profile.id } } } });

  return (
    <div className="flex flex-col space-y-4 items-center h-full text-primary w-full dark:bg-[#1e1f22] py-3">
      <NavigationAction />

      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />

      <ScrollArea className="flex-1 w-full">
        {servers.map((server, index) => (
          <div key={index} className="mb-4">
            <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
          </div>
        ))}
      </ScrollArea>

      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-[48px] h-[48px]" } }} />
      </div>
    </div>
  );
};

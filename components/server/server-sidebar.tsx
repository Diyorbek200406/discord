import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { redirect } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { ServerSection } from "./server-section";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className={"mr-2 w-5 h-5"} />,
  [ChannelType.AUDIO]: <Mic className={"mr-2 w-5 h-5"} />,
  [ChannelType.VIDEO]: <Video className={"mr-2 w-5 h-5"} />,
};

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className={"mr-2 w-5 h-5 text-rose-500"} />,
  [MemberRole.MODERATOR]: <ShieldCheck className={"mr-2 w-5 h-5 text-indigo-500"} />,
  [MemberRole.GUEST]: null,
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profule = await currentProfile();
  if (!profule) return redirect("/");

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: { orderBy: { createdAt: "asc" } },
      members: { include: { profile: true }, orderBy: { role: "asc" } },
    },
  });

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
  const members = server?.members.filter((member) => member.profileId !== profule.id);

  if (!server) return redirect("/");

  const role = server.members.find((member) => member.profileId === profule.id)?.role;

  return (
    <div className="flex flex-col w-full h-full text-primary bg-[#f2f3f5] dark:bg-[#2b2d31]">
      <ServerHeader role={role} server={server} />

      <ScrollArea className={"flex-1 px-3"}>
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>

        <Separator className={"bg-zinc-300 dark:bg-zinc-700 rounded-md my-2"} />

        {!!textChannels?.length && (
          <div className={"mb-2"}>
            <ServerSection />
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ChatHeader } from "@/components/chat/chat-header";

interface ChannelIdPageProps {
  params: { serverId: string; channelId: string };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({ where: { id: params.channelId } });
  const member = await db.member.findFirst({ where: { profileId: profile.id, serverId: params.serverId } });

  if (!channel || !member) return redirect("/");

  return (
    <div className={"bg-white dark:bg-[#313338] flex flex-col h-full"}>
      <ChatHeader name={channel.name} type="channel" serverId={channel.serverId} />
    </div>
  );
};

export default ChannelIdPage;

"use client";

import axios from "axios";
import qs from "query-string";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MemberRole } from "@prisma/client";
import { useModalStore } from "@/hooks/use-modal-store";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-5 h-5 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-5 h-5 ml-2 text-rose-500" />,
};

export const MembersModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModalStore();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";

  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({ url: `/api/members/${memberId}`, query: { serverId: server?.id } });

      const { data } = await axios.patch(url, { role });
      if (!data) throw new Error("Failed to update role");

      router.refresh();
      onOpen("members", { server: data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({ url: `/api/members/${memberId}`, query: { serverId: server?.id } });
      const { data } = await axios.delete(url);

      router.refresh();
      onOpen("members", { server: data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Manage Members</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">{server?.members?.length} Members</DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member, index) => (
            <div key={index} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member?.profile?.imageUrl} />

              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-cente gap-x-2">
                  {member?.profile?.name} {roleIconMap[member?.role]}
                </div>
                <p className="text-xs text-zinc-500">{member?.profile?.email}</p>
              </div>

              {server?.profileId !== member?.profileId && loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="w-5 h-5 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="w-5 h-5 mr-2" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => onRoleChange(member?.id, "GUEST")}>
                              <Shield className="w-5 h-5 mr-2" />
                              GUEST
                              {member?.role === "GUEST" && <Check className="w-5 h-5 ml-auto" />}
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => onRoleChange(member?.id, "MODERATOR")}>
                              <ShieldCheck className="w-5 h-5 mr-2" />
                              MODERATOR
                              {member?.role === "MODERATOR" && <Check className="w-5 h-5 ml-auto" />}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member?.id)}>
                        <Gavel className="w-5 h-5 mr-2" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {loadingId === member.id && <Loader2 className="animate-spin w-5 h-5 text-zinc-500 ml-auto" />}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

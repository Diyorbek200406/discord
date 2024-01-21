"use client";

import { MemberRole } from "@prisma/client";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";

import { ServerWithMembersWithProfiles } from "@/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useModalStore } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
  role?: MemberRole;
  server: ServerWithMembersWithProfiles;
}

export const ServerHeader = ({ role, server }: ServerHeaderProps) => {
  const { onOpen } = useModalStore();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          <span>{server.name}</span>
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 p-2 text-sm cursor-pointer" onClick={() => onOpen("invite", { server })}>
            Invite People <UserPlus className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem className="text-yellow-400 p-2 text-sm cursor-pointer" onClick={() => onOpen("editServer", { server })}>
            Server Settings <Settings className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem className="text-blue-400 p-2 text-sm cursor-pointer" onClick={() => onOpen("members", { server })}>
            Manage Members <Users className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem className="text-green-400 p-2 text-sm cursor-pointer" onClick={() => onOpen("createChannel", { server })}>
            Create Channel <PlusCircle className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem className="text-rose-500 p-2 text-sm cursor-pointer" onClick={() => onOpen("deleteServer", { server })}>
            Delete Server <Trash className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem className="text-rose-500 p-2 text-sm cursor-pointer" onClick={() => onOpen("leaveServer", { server })}>
            Leave Server <LogOut className="w-5 h-5 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

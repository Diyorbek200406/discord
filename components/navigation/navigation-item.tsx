"use client";

import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button className="group relative flex items-center" onClick={() => router.push(`/servers/${id}`)}>
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "group-hover:h-[36px]" : "h-[8px]"
          )}
        />

        <div className={cn("relative group flex mx-3 h-[48px] w-[48px]")}></div>
      </button>
    </ActionTooltip>
  );
};

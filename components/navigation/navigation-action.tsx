"use client";

import { Plus } from "lucide-react";

import { useModalStore } from "@/hooks/use-modal-store";
import { ActionTooltip } from "@/components/action-tooltip";

export const NavigationAction = () => {
  const { onOpen } = useModalStore();

  return (
    <ActionTooltip label="Add a server" side="right" align="center">
      <button className="group flex items-center" onClick={() => onOpen("createServer")}>
        <div className="w-[48px] h-[48px] bg-background dark:bg-neutral-700 group-hover:bg-emerald-500 flex items-center justify-center overflow-hidden transition-all rounded-[24px] group-hover:rounded-[16px]">
          <Plus className="group-hover:text-white transition text-emerald-500" size={25} />
        </div>
      </button>
    </ActionTooltip>
  );
};

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ServerSidebar } from "@/components/server/server-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

interface MobileToggleProps {
  serverId: string;
}

export const MobileToggle = ({ serverId }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={"md:hidden"} variant={"ghost"} size={"icon"}>
          <Menu className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        </Button>
      </SheetTrigger>

      <SheetContent className={"p-0 flex gap-0"} side={"left"}>
        <div className={"w-[72px]"}>
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

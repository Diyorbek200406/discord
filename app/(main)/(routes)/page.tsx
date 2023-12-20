import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h1>Discord Clone</h1>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  );
}

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import CurrentSession from "@/components/current-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/app/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
        <Badge>Private Page</Badge>
        <div className="text-2xl font-bold">Unauthorized </div>

        <Link href="/">
          <Button variant="outline" className="cursor-pointer">
            <ArrowLeftIcon />
            Jump back to HomePage
          </Button>
        </Link>

        <Separator />

        <CurrentSession session={session} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <Badge>Private Page</Badge>
        <div className="text-2xl font-bold">
          Authorized: Dashboard for {session.user.email}
        </div>
        <Link href="/">
          <Button variant="outline" className="cursor-pointer">
            <ArrowLeftIcon />
            Jump back to HomePage
          </Button>
        </Link>
      </div>

      <Separator />

      <CurrentSession session={session} />
    </div>
  );
}

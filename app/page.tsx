"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";

import CurrentSession from "@/components/current-session";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <Badge variant="secondary">Public Page</Badge>

        <div className="text-2xl font-bold">Home</div>
        <Link href="/about">
          <Button variant="outline" className="cursor-pointer">
            <ArrowRightIcon />
            Jump to About (public page)
          </Button>
        </Link>

        <Link href="/dashboard">
          <Button variant="outline" className="cursor-pointer">
            <ArrowRightIcon />
            Jump to Dashboard (private page)
          </Button>
        </Link>

        <Separator />

        {!session?.user ? (
          <Link href="/login">
            <Button variant="default" className="cursor-pointer">
              <UserIcon />
              Click to Login
            </Button>
          </Link>
        ) : (
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() =>
              signOut({
                redirectTo: "/  ",
              })
            }
          >
            <LogOutIcon />
            Click to Logout
          </Button>
        )}

        <CurrentSession session={session} />
      </div>
    </div>
  );
}

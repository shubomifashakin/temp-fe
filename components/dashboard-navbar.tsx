"use client";

import { useEffect } from "react";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { LogOut, Settings } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Hamburger from "@/components/ui/hamburger";

import { getUserInfo, logout } from "@/data-service/mutations";

interface DashboardNavbarProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export function DashboardNavbar({
  onMenuToggle,
  sidebarOpen,
}: DashboardNavbarProps) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    mutationKey: ["logout"],

    onSuccess: () => {
      router.replace("/auth/sign-in");
    },

    onError: (error) => {
      toast.error(error.message);
      if (error.cause === 401) {
        return router.replace("/auth/sign-in");
      }
    },
  });

  function handleLogout() {
    mutate();
  }

  const {
    status,
    error,
    data: user,
  } = useQuery({
    queryKey: ["user"],
    staleTime: Infinity,
    queryFn: getUserInfo,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  useEffect(
    function () {
      if (error && error.cause === 401) {
        router.replace("/auth/sign-in");
      }
    },
    [error, router],
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto px-6 py-4 flex items-center justify-between max-w-6xl w-full">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-playfair font-bold text-foreground">
            Temp
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={status !== "success"}>
              <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src={user?.picture || ""}
                    alt={user?.name || "User avatar"}
                  />

                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-muted border-border font-mono border-dashed px-0"
            >
              <DropdownMenuLabel className="font-normal font-mono">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground tracking-tight">
                    {user?.name}
                  </p>

                  <p className="text-xs text-muted-foreground font-light">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <div className="border-t border-border my-2 border-dashed" />

              <DropdownMenuItem
                className="cursor-pointer gap-2 text-sm font-light tracking-tight hover:text-orange-500! duration-150 transition-colors"
                asChild
              >
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4 hover:text-orange-500! duration-150 transition-colors" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <div className="border-t border-border my-2 border-dashed" />

              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isPending}
                className="cursor-pointer gap-2 text-sm font-light tracking-tight hover:text-orange-500! duration-150 transition-colors"
              >
                <LogOut className="h-4 w-4 hover:text-orange-500! duration-150 transition-colors" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Hamburger onMenuToggle={onMenuToggle} opened={sidebarOpen} />
        </div>
      </div>
    </nav>
  );
}

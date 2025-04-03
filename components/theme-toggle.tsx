"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-9 h-9 border-transparent hover:border-orange-200 dark:hover:border-orange-800/50 hover:bg-orange-100/80 dark:hover:bg-orange-900/30"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-orange-600 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all text-orange-300 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border border-orange-200 dark:border-orange-900/50 rounded-lg shadow-md shadow-orange-200/30 dark:shadow-orange-900/20"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={
            theme === "light"
              ? "text-orange-600 font-medium bg-orange-50 dark:bg-orange-900/10"
              : ""
          }
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={
            theme === "dark"
              ? "text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/10"
              : ""
          }
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={
            theme === "system"
              ? "text-orange-500 font-medium bg-orange-50 dark:bg-orange-900/10"
              : ""
          }
        >
          <span className="mr-2">💻</span>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

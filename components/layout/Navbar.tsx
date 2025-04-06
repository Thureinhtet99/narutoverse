"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./theme-toggle";
import {
  Users,
  Mountain,
  PenTool,
  Skull,
  Flame,
  ShieldUser,
} from "lucide-react";
import narutoLogo from "@/public/images/naruto-logo.png";

const navLinks = [
  { name: "Characters", href: "/characters", icon: <Users size={16} /> },
  { name: "Clans", href: "/clans", icon: <ShieldUser size={16} /> },
  { name: "Villages", href: "/villages", icon: <Mountain size={16} /> },
  { name: "Teams", href: "/teams", icon: <PenTool size={16} /> },
  { name: "Akatsuki", href: "/akatsuki", icon: <Skull size={16} /> },
  { name: "Tailed Beasts", href: "/tailed-beasts", icon: <Flame size={16} /> },
  // { name: "Kara", href: "/kara", icon: <Zap size={16} /> },
  // {
  //   name: "Kekkei Genkai",
  //   href: "/kekkei-genkai",
  //   icon: <Droplet size={16} />,
  // },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="border-b sticky top-0 z-40 backdrop-blur-sm bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-900 dark:to-gray-950 shadow-sm px-4">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between relative z-10">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-orange-500 dark:border-orange-400 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-orange-300/50 dark:group-hover:shadow-orange-600/30">
              <Image
                src={narutoLogo}
                alt="Narutoverse Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block text-orange-600 dark:text-orange-400 group-hover:text-orange-500 dark:group-hover:text-orange-300 transition-colors">
              Narutoverse
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:justify-center">
          <ul className="flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-all relative flex items-center",
                      isActive
                        ? "text-orange-600 dark:text-orange-400 font-semibold bg-orange-50 dark:bg-orange-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-300 hover:bg-orange-50/80 dark:hover:bg-orange-900/10"
                    )}
                  >
                    <span className="mr-1 inline-flex items-center justify-center">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 dark:bg-orange-400"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Theme Toggle and Search */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-orange-100/80 dark:hover:bg-gray-800/70 transition-colors border border-transparent hover:border-orange-200 dark:hover:border-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 border-t border-orange-200 dark:border-gray-800",
          isMenuOpen ? "max-h-[400px]" : "max-h-0"
        )}
      >
        <div className="container py-4">
          <ul className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-2 inline-flex items-center justify-center">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

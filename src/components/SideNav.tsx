"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  HiOutlineHome,
  HiOutlineFire,
  HiOutlineVideoCamera,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUserCircle,
} from "react-icons/hi2";

const navItems = [
  { label: "Home", href: "/feed", icon: HiOutlineHome },
  { label: "For You", href: "/explore", icon: HiOutlineFire },
  { label: "Live", href: "/live", icon: HiOutlineVideoCamera },
  { label: "Messages", href: "/messages", icon: HiOutlineChatBubbleLeftRight },
  { label: "Creator", href: "/creator", icon: HiOutlineUserCircle },
];

export default function SideNav({ className }: { className?: string }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    // If next-auth is configured this will sign the user out. Falls back to console.log.
    try {
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      // signOut may still throw if next-auth isn't wired up at runtime for some reason.
      // Keep a visible fallback for development.
      // eslint-disable-next-line no-console
      console.log("Logout clicked", err);
    }
  };

  return (
    <nav
      aria-label="Primary"
      className={`hidden md:flex md:flex-col w-64 bg-gray-900 border-r border-gray-800 p-6 gap-8 ${className ?? ""}`}
    >
      <div className="text-2xl font-bold text-red-500">🎬 Creator Prime</div>

      <div className="flex flex-col gap-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = !!pathname && pathname === href || (!!pathname && pathname.startsWith(href + "/"));

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-500 ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition mt-auto focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Logout
      </button>
    </nav>
  );
}

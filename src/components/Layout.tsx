"use client";

import { ReactNode } from "react";
import NavBar from "./NavBar";
import SideNav from "./SideNav";
import SuggestedAccounts from "./SuggestedAccounts";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-black">
      <SideNav />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBar />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">{children}</div>
          <SuggestedAccounts />
        </main>
      </div>
    </div>
  );
}

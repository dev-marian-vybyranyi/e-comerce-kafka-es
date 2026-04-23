import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={onTabChange} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">{children}</main>
    </div>
  );
}

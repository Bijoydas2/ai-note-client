// src/components/Sidebar.tsx
import React from "react";
import { BookOpen, Briefcase, Lightbulb, Calendar, Search } from "lucide-react";

type Props = {
  categories: { name: string; count: number }[];
  selected: string;
  onSelect: (c: string) => void;
};

export const Sidebar: React.FC<Props> = ({ categories, selected, onSelect }) => {
  return (
    <aside className="w-64 bg-[#0e2430] text-white min-h-[calc(100vh-64px)] p-6 border-r border-[#12202b]">
      <h3 className="text-lg font-bold mb-6">Categories</h3>
      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c.name}>
            <button
              onClick={() => onSelect(c.name)}
              className={`w-full flex items-center justify-between gap-3 p-3 rounded-md transition 
                 ${selected === c.name ? "bg-[#071427] shadow-inner" : "hover:bg-[#081826/60]"}`}
            >
              <div className="flex items-center gap-3">
                {/* icon by category */}
                <span className="opacity-80">
                  {c.name === "All" ? <Search /> : c.name === "Work" ? <Briefcase /> : c.name === "Personal" ? <BookOpen /> : <Lightbulb />}
                </span>
                <span className="text-left">{c.name}</span>
              </div>
              <span className="bg-[#122031] text-gray-300 px-2 py-0.5 rounded-full text-sm">{c.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

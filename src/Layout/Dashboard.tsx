// src/pages/Dashboard.tsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Plus, Menu } from "lucide-react";
import { mockNotes } from "../data/mockNotes";
import { Sidebar } from "../Components/sidebar";
import { NoteCard } from "../Components/NoteCard";
import { Navbar } from "../Components/Navbar";

export const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [dark, setDark] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // categories
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    map.set("All", mockNotes.length);
    mockNotes.forEach((n) => map.set(n.category, (map.get(n.category) || 0) + 1));
    const list = ["All", "Work", "Personal", "Ideas", "Research", "Meeting"];
    return list.map((name) => ({ name, count: map.get(name) || 0 }));
  }, []);

  // filter logic
  const filtered = mockNotes.filter((n) => {
    const matchesCategory = selectedCategory === "All" || n.category === selectedCategory;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // dark mode toggle
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  // close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handle category select
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSidebarOpen(false); // close sidebar on mobile
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1724] text-white">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar
          search={search}
          onSearch={setSearch}
          onToggleDark={() => setDark((s) => !s)}
          dark={dark}
        />
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`fixed md:sticky top-[64px] left-0 z-40 h-[calc(100vh-64px)] w-64 bg-[#101b29] transition-transform duration-300 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Sidebar
            categories={categories}
            selected={selectedCategory}
            onSelect={handleSelectCategory}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 mt-4">
          {/* mobile sidebar toggle */}
          <button
            className="md:hidden mb-4 bg-[#0b3b7a] px-3 py-2 rounded-md flex items-center gap-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={18} /> <span>Menu</span>
          </button>

          {/* Header section */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {selectedCategory === "All" ? "All Notes" : selectedCategory}
              </h2>
              <p className="text-gray-400 mt-1">
                {filtered.length} {filtered.length === 1 ? "note" : "notes"}
              </p>
            </div>

            <Button
              className="p-button-rounded bg-white text-black hover:bg-gray-200 transition-all"
              icon={<Plus size={18} />}
              label="New Note"
            />
          </div>

          {/* Notes Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No notes found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

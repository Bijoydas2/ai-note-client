// src/pages/Dashboard.tsx
import React, { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Plus } from "lucide-react"; // Sidebar lucide থেকে না, তাই এখান থেকে Sidebar remove করো
import { mockNotes } from "../../data/mockNotes";
import { Navbar } from "../../Components/Navbar";
import { NoteCard } from "../../Components/NoteCard";
import { Sidebar } from "../../Components/Sidebar"; // এইটা তোমার নিজের Sidebar component import হওয়া উচিত

export const Dashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [dark, setDark] = useState<boolean>(true);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    map.set("All", mockNotes.length);
    mockNotes.forEach((n) => map.set(n.category, (map.get(n.category) || 0) + 1));
    const list = ["All", "Work", "Personal", "Ideas", "Research", "Meeting"];
    return list.map((name) => ({ name, count: map.get(name) || 0 }));
  }, []);

  const filtered = mockNotes.filter((n) => {
    const matchesCategory = selectedCategory === "All" || n.category === selectedCategory;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <div className="min-h-screen flex bg-[#0f1724] text-white">
      <Sidebar categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

      <div className="flex-1">
        <Navbar search={search} onSearch={setSearch} onToggleDark={() => setDark((s) => !s)} dark={dark} />

        <main className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {selectedCategory === "All" ? "All Notes" : selectedCategory}
              </h2>
              <p className="text-gray-400 mt-1">
                {filtered.length} {filtered.length === 1 ? "note" : "notes"}
              </p>
            </div>

            <div>
              <Button
                className="p-button-rounded bg-white text-black hover:bg-gray-200 transition-all"
                icon={<Plus size={18} />}
                label="New Note"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((note: Note) => (
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

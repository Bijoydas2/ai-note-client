// src/Components/NoteCard.tsx
import React, { useState } from "react";
import { Button } from "primereact/button";
import { MoreVertical, Eye, Edit2, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Loading from "../Page/Loading";

const API = "http://localhost:5000"; 


export type Note = {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
};

type Props = {
  selectedCategory?: string;
  search?: string;
};

export const NoteCard: React.FC<Props> = ({ selectedCategory = "All", search = "" }) => {
  const queryClient = useQueryClient();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const navigate = useNavigate();

  const categoryColors: Record<string, string> = {
    Work: "bg-blue-600",
    Personal: "bg-pink-600",
    Ideas: "bg-green-600",
    Research: "bg-yellow-600",
    Meeting: "bg-purple-600",
  };

  // Fetch notes
  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/notes`);
      if (!res.ok) throw new Error("Failed to fetch notes");
      return res.json();
    },
  });

  // Delete note
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await fetch(`${API}/api/notes/${id}`, { method: "DELETE" });
      queryClient.invalidateQueries(["notes"]);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchesCategory = selectedCategory === "All" || n.category === selectedCategory;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  if (isLoading) return <Loading message="Loading notes..."/>;
  if (!filteredNotes.length) return <p className="text-gray-400 text-center">No notes found.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredNotes.map(note => (
        <div
          key={note._id}
          className="relative bg-[#0b1220] text-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.03] border border-[#122036]"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
              <div className="flex items-center gap-3 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    categoryColors[note.category] || "bg-gray-600"
                  }`}
                >
                  {note.category}
                </span>
                <span className="text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* 3-dot menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpenId(menuOpenId === note._id ? null : note._id)}
                className="p-2 hover:bg-[#1a2335] rounded-full transition"
              >
                <MoreVertical className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>

              {menuOpenId === note._id && (
                <div className="absolute right-0 mt-2 w-40 bg-[#1c2742] rounded-lg border border-gray-700 shadow-lg z-50">
                  <button 
                  onClick={() => navigate(`/note/${note._id}`)}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#273453] text-sm">
                    <Eye className="h-4 w-4 text-blue-400" /> View
                  </button>
                  <button 
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#273453] text-sm">
                    <Edit2 className="h-4 w-4 text-yellow-400"
                    onClick={() => navigate(`/update/${note._id}`)} /> 
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#273453] text-sm text-red-400"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content snippet */}
          <p className="text-gray-300 mb-3">
            {note.content.length > 160 ? note.content.slice(0, 160) + "..." : note.content}
          </p>

          {/* Bottom Buttons */}
          <div className="flex gap-2 mt-2">
            <Button
             icon={<Eye />} 
             label="View" 
             className="p-button-outlined" 
             onClick={() => navigate(`/note/${note._id}`)}/>
            <Button 
            icon={<Edit2 />}
             label="Edit" 
             className="p-button-outlined" 
             onClick={() => navigate(`/update/${note._id}`)}/>
          </div>
        </div>
      ))}
    </div>
  );
};

import React from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, FileText, Edit2, FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const API = "http://localhost:5000";

const categoryColors: Record<string, string> = {
  Work: "bg-blue-600",
  Personal: "bg-pink-600",
  Ideas: "bg-green-600",
  Research: "bg-yellow-600",
  Meeting: "bg-purple-600",
};

export const NoteView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch single note
  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const res = await fetch(`${API}/api/notes/${id}`);
      if (!res.ok) throw new Error("Failed to fetch note");
      return res.json();
    },
  });

  if (isLoading) return <p className="text-gray-400 text-center mt-10">Loading note...</p>;
  if (!note) return <p className="text-gray-400 text-center mt-10">Note not found.</p>;

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-6 sm:p-10">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold mt-4">{note.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                categoryColors[note.category] || "bg-gray-600"
              }`}
            >
              {note.category}
            </span>
            <span>
              Created on{" "}
              {new Date(note.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-2">
          <button className="flex items-center gap-1 bg-[#1c2742] hover:bg-[#243150] text-sm px-3 py-2 rounded-lg transition">
            <Edit2 size={16} /> Edit
          </button>
          <button className="flex items-center gap-1 bg-[#1c2742] hover:bg-[#243150] text-sm px-3 py-2 rounded-lg transition">
            <FileDown size={16} /> PDF
          </button>
          <button className="flex items-center gap-1 bg-[#1c2742] hover:bg-[#243150] text-sm px-3 py-2 rounded-lg transition">
            <FileText size={16} /> Markdown
          </button>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-[#11244b] p-5 rounded-xl mb-6">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">AI Summary</span>
        </h3>
        <p className="text-gray-200 leading-relaxed">
          {note.summary ||
            "Comprehensive meeting notes covering product launch planning, assignments, budget allocation, and next steps."}
        </p>
      </div>

      {/* Note Content */}
      <div className="bg-[#111827] p-6 rounded-xl border border-[#1e293b] text-gray-200 leading-relaxed whitespace-pre-line">
        {note.content}
      </div>
    </div>
  );
};

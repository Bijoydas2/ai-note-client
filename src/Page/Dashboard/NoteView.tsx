import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, FileText, Edit2, FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthProvider";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import ErrorPage from "../ErrorPage";
import Loading from "../Loading";

const API = "https://ai-note-server-1.onrender.com";

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
  const { user } = useContext(AuthContext);

  // Fetch single note
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      if (!user) throw new Error("User not logged in");
      const token = await user.getIdToken();
      const res = await fetch(`${API}/api/notes/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch note");
      return res.json();
    },
    enabled: !!user,
  });

  if (isLoading) return <Loading message="Loading ..." />;
  if (isError || !note) return <ErrorPage message="Note not found." />;

  // PDF Download using jsPDF
  const downloadPDF = () => {
    if (!note) return;
    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    let y = 40;

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(note.title, 40, y);
    y += 30;

    doc.setFontSize(12);
    doc.text(`Category: ${note.category}`, 40, y);
    y += 20;

    if (note.summary) {
      doc.text("Summary:", 40, y);
      y += 15;
      doc.text(note.summary, 40, y, { maxWidth: 520 });
      y += 40;
    }

    doc.text("Content:", 40, y);
    y += 15;
    doc.text(note.content, 40, y, { maxWidth: 520 });

    doc.save(`${note.title}.pdf`);
    toast.success("PDF downloaded successfully!");
  };

  // Copy Markdown
  const copyMarkdown = async () => {
    let markdownText = `# ${note.title}\n\n**Category:** ${note.category}\n\n`;
    if (note.summary) markdownText += `**Summary:**\n${note.summary}\n\n`;
    markdownText += `${note.content}\n`;

    try {
      await navigator.clipboard.writeText(markdownText);
      toast.success("Note copied as Markdown!");
    } catch {
      toast.warn("Failed to copy Markdown");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-4 sm:p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        {/* Left: Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back
        </button>

        {/* Right: Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
          <button
            onClick={() => navigate(`/update/${note._id}`)}
            className="flex items-center gap-1 bg-[#1c2742] hover:bg-[#243150] text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-1 bg-[#1c2742] hover:bg-[#243150] text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition"
          >
            <FileDown size={14} /> PDF
          </button>
          <button
            onClick={copyMarkdown}
            className="flex items-center gap-1 bg-[#1c2742] hover:bg-[#243150] text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition"
          >
            <FileText size={14} /> Markdown
          </button>
        </div>
      </div>

      {/* Note Info */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{note.title}</h1>
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs sm:text-sm text-gray-400">
        <span className={`px-2 py-1 rounded-full font-medium ${categoryColors[note.category] || "bg-gray-600"}`}>
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

      {/* Visible Note Content */}
      <div className="flex flex-col gap-4">
        {note.summary && (
          <div className="bg-[#11244b] p-4 sm:p-5 rounded-xl">
            <h3 className="font-semibold mb-2 text-sm sm:text-base flex items-center gap-2">
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">AI Summary</span>
            </h3>
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed">{note.summary}</p>
          </div>
        )}
        <div className="bg-[#111827] p-4 sm:p-6 rounded-xl border border-[#1e293b] text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {note.content}
        </div>
      </div>
    </div>
  );
};

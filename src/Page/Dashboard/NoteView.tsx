import React, { useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, FileText, Edit2, FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthProvider";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
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
  const pdfRef = useRef<HTMLDivElement>(null);

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

  if (isLoading) return <Loading message="Loading ....."/>;
  if (isError || !note) return <ErrorPage message="Note not found."/>;

  // PDF Download function
  const downloadPDF = async () => {
    if (!pdfRef.current) return;

    try {
      await html2pdf()
        .set({
          margin: 10,
          filename: `${note.title}.pdf`,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(pdfRef.current)
        .save();
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF download failed:", err);
      toast.warn("Failed to download PDF. See console for details.");
    }
  };

  // Markdown Copy
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
    <div className="min-h-screen bg-[#0b1220] text-white p-6 sm:p-10">
      <title>Note View</title>
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

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => note?._id && navigate(`/update/${note._id}`)}
            className="flex items-center gap-1 bg-[#1c2742] hover:bg-[#243150] text-sm px-3 py-2 rounded-lg transition"
          >
            <Edit2 size={16} /> Edit
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-1 bg-[#1c2742] hover:bg-[#243150] text-sm px-3 py-2 rounded-lg transition"
          >
            <FileDown size={16} /> PDF
          </button>
          <button
            onClick={copyMarkdown}
            className="flex items-center gap-1 bg-[#1c2742] hover:bg-[#243150] text-sm px-3 py-2 rounded-lg transition"
          >
            <FileText size={16} /> Markdown
          </button>
        </div>
      </div>

      {/* Visible note content */}
      <div>
        <div className="bg-[#11244b] p-5 rounded-xl mb-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">AI Summary</span>
          </h3>
          <p className="text-gray-200 leading-relaxed">{note.summary}</p>
        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-[#1e293b] text-gray-200 leading-relaxed whitespace-pre-line">
          {note.content}
        </div>
      </div>

      {/* Hidden PDF container (white background, black text) */}
      <div style={{ display: "none" }}>
        <div ref={pdfRef} className="p-6 bg-white text-black">
          <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
          <p className="mb-2"><strong>Category:</strong> {note.category}</p>
          {note.summary && (
            <p className="mb-2"><strong>Summary:</strong> {note.summary}</p>
          )}
          <div>{note.content}</div>
        </div>
      </div>
    </div>
  );
};

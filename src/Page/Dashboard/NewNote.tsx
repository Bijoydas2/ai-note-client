import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { FileText, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AuthContext } from "../../Context/AuthProvider";
import Loading from "../Loading";

const API = "https://ai-note-server-1.onrender.com";

export const NewNote: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>("");

  const categories = [
    { label: "Work", value: "Work" },
    { label: "Personal", value: "Personal" },
    { label: "Ideas", value: "Ideas" },
    { label: "Research", value: "Research" },
    { label: "Meeting", value: "Meeting" },
  ];

  // --- AI Suggest Title ---
  const suggestTitleMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API}/api/gemini/suggest-title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to suggest title");
      return res.json();
    },
    onSuccess: (data) => {
      setTitle(data.title || "");
      toast.success("AI suggested a title!");
    },
    onError: () => toast.error("AI failed to suggest title."),
  });

  // --- AI Summarize ---
  const summarizeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API}/api/gemini/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to summarize");
      return res.json();
    },
    onSuccess: (data) => {
      setSummary(data.summary || "");
      setContent(
        (prev) =>
          prev + "\n\n---\n🧠 Summary:\n" + (data.summary || "No summary found")
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Summary generated successfully!");
    },
    onError: () => toast.error("AI failed to summarize your note."),
  });

  // --- Save Note ---
  const saveNoteMutation = useMutation({
    mutationFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(`${API}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, category, summary }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      return res.json();
    },
    onSuccess: () => {
      toast.success(" Note saved successfully!");
      navigate("/dashboard");
    },
    onError: () => toast.error(" Failed to save note."),
  });

  const isProcessing =
    saveNoteMutation.isPending ||
    suggestTitleMutation.isPending ||
    summarizeMutation.isPending;

  if (isProcessing && !saveNoteMutation.isPending && !suggestTitleMutation.isPending && !summarizeMutation.isPending) {
    return <Loading message="Processing your note..." />;
  }

  const handleSave = () => {
    if (!title || !content || !category) {
      toast.warn("Please fill all fields before saving.");
      return;
    }
    saveNoteMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e1420] to-[#111b2e] text-white px-6 py-8 flex justify-center transition-opacity duration-500">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/dashboard" className="text-gray-400 hover:text-white">
            ← Back
          </Link>
          <h2 className="text-xl text-center hidden md:flex mb-2 font-semibold tracking-wide lg:flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            Create a New Note
          </h2>
          <div className="flex gap-3">
            <Button
              label="Cancel"
              className="bg-gray-700 text-white border-none px-5 py-2 rounded-xl hover:bg-gray-600"
              onClick={() => navigate("/dashboard")}
              disabled={isProcessing}
            />
            <Button
              label={saveNoteMutation.isPending ? "Saving..." : "Save"}
              icon="pi pi-save"
              className={`${
                saveNoteMutation.isPending
                  ? "bg-blue-800 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white border-none px-5 py-2 rounded-xl font-medium`}
              onClick={handleSave}
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Glass Card */}
        <div
          className={`bg-[#1b2743]/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/10 transition-all duration-500 ${
            isProcessing ? "opacity-70" : "opacity-100"
          }`}
        >
          <h2 className="text-xl text-center lg:hidden md:hidden mb-2 font-semibold tracking-wide flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            Create a New Note
          </h2>

          {/* Title + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Title</label>
              <InputText
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full bg-[#141c2f] p-2 text-white border border-gray-700 rounded-xl focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <Dropdown
                value={category}
                onChange={(e) => setCategory(e.value)}
                options={categories}
                placeholder="Select category"
                appendTo={document.body}
                className="w-full bg-[#141c2f] p-2 text-white border border-gray-700 rounded-xl"
                panelClassName="bg-[#1e253b] text-white p-2 z-50"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-8">
           
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">Content</label>
              <InputTextarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={14}
                autoResize
                placeholder="Start writing your thoughts..."
                className="w-full bg-[#141c2f] text-white border p-4 border-gray-700 rounded-xl leading-relaxed focus:border-blue-400"
              />
            </div>

            {/* AI Buttons */}
            <div className="flex flex-row md:flex-col gap-4 justify-center md:justify-start md:w-48">
              <Button
                label={suggestTitleMutation.isPending ? "🤔 Thinking..." : "⚡ AI Suggest Title"}
                onClick={() => content.trim() && suggestTitleMutation.mutate()}
                disabled={isProcessing || !content.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none px-5 py-2 rounded-xl hover:opacity-90"
              />
              <Button
                label={summarizeMutation.isPending ? "🧠 Summarizing..." : "🧩 Summarize Note"}
                onClick={() => content.trim() && summarizeMutation.mutate()}
                disabled={isProcessing || !content.trim()}
                className="bg-indigo-700 text-white border-none px-5 py-2 rounded-xl hover:bg-indigo-600"
              />
              {isProcessing && <Loader2 className="animate-spin text-gray-400 ml-2 self-center" />}
            </div>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default NewNote;

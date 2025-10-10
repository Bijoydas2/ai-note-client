import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const API = "http://localhost:5000";

export const NewNote: React.FC = () => {
  const navigate = useNavigate();
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

  // AI Suggest Title
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
    onSuccess: (data) => setTitle(data.title || ""),
  });

  //  AI Summarize
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
      setContent((prev) => prev + "\n\n---\n🧠 Summary:\n" + (data.summary || ""));
    },
  });

  // Save note to backend
  const saveNoteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API}/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, summary }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      return res.json();
    },
    onSuccess: () => navigate("/dashboard"),
  });

  const isLoading = suggestTitleMutation.isPending || summarizeMutation.isPending;

  const handleSave = () => {
    if (!title || !content || !category) {
      alert("Please fill all fields");
      return;
    }
    saveNoteMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e1420] to-[#111b2e] text-white px-6 py-8 flex justify-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/dashboard" className="text-gray-400 hover:text-white">
            ← Back
          </Link>
          <h2 className="text-2xl hidden md:block lg:block font-semibold tracking-wide text-center flex-1">
            📝 Create a New Note
          </h2>
          <div className="flex gap-3">
            <Button
              label="Cancel"
              className="bg-gray-700 text-white border-none px-5 py-2 rounded-xl hover:bg-gray-600"
              onClick={() => navigate("/dashboard")}
            />
            <Button
              label="Save"
              icon="pi pi-save"
              className="bg-blue-500 text-white border-none px-5 py-2 rounded-xl hover:bg-blue-600 font-medium"
              onClick={handleSave}
            />
          </div>
        </div>

        {/* Glass Card */}
        <div className="bg-[#1b2743]/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/10 transition-all duration-300 hover:shadow-blue-500/10">
          <h2 className="text-xl text-center block lg:hidden md:hidden mb-2 font-semibold tracking-wide ">
            📝 Create a New Note
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
                panelClassName="bg-[#1e253b] text-white p-2 space-y-2"
              />
            </div>
          </div>

          {/* Main Content + AI Tools */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Textarea */}
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
                disabled={isLoading || !content.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none px-5 py-2 rounded-xl hover:opacity-90"
              />
              <Button
                label={summarizeMutation.isPending ? "🧠 Summarizing..." : "🧩 Summarize Note"}
                onClick={() => content.trim() && summarizeMutation.mutate()}
                disabled={isLoading || !content.trim()}
                className="bg-indigo-700 text-white border-none px-5 py-2 rounded-xl hover:bg-indigo-600"
              />
              {isLoading && <Loader2 className="animate-spin text-gray-400 ml-2 self-center" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewNote;

import React, { useContext, useState } from "react";
import { Button } from "primereact/button";
import { MoreVertical, Eye, Edit2, Trash2, Pin, PinOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Loading from "../Page/Loading";
import { AuthContext } from "../Context/AuthProvider";
import ErrorPage from "../Page/ErrorPage";
import { toast } from "react-toastify";

const API = "https://ai-note-server-1.onrender.com";

export type Note = {

  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  pinned?: boolean;
};

type Props = {
  selectedCategory?: string;
  search?: string;
};

export const NoteCard: React.FC<Props> = ({ selectedCategory = "All", search = "" }) => {
  const queryClient = useQueryClient();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const {user}= useContext(AuthContext)
  const navigate = useNavigate();

  const categoryColors: Record<string, string> = {
    Work: "bg-blue-600",
    Personal: "bg-pink-600",
    Ideas: "bg-green-600",
    Research: "bg-yellow-600",
    Meeting: "bg-purple-600",
  };

  //get all
const { data: notes = [], isLoading } = useQuery<Note[]>({
  queryKey: ["notes"],
  queryFn: async () => {
   
    const token = await user.getIdToken(); 
    const res = await fetch(`${API}/api/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch notes");
    }
    return res.json(); 
  },
  enabled: !!user,
});



  // Delete mutation
  const deleteMutation = useMutation({
  mutationFn: async (id: string) => {
    const token = await user.getIdToken();
    const res = await fetch(`${API}/api/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete note");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["notes"]);
    toast.success("🗑️ Note deleted successfully!");
  },
  onError: (error) => {
    console.error("Delete error:", error);
    toast.error("❌ Failed to delete note. Please try again.");
  },
});

  // Pin/unpin mutation with optimistic update
  const pinMutation = useMutation({
    mutationFn: async ({ id, pinned }: { id: string; pinned: boolean }) => {
      const token = await user.getIdToken();
      const res = await fetch(`${API}/api/notes/pin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pinned }),
    });
      if (!res.ok) throw new Error("Failed to toggle pin");
      return res.json();
    },
    onMutate: async ({ id, pinned }) => {
      await queryClient.cancelQueries(["notes"]);
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) =>
        old?.map((n) => (n._id === id ? { ...n, pinned } : n))
      );

      return { previousNotes };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["notes"]);
    },
  });

  if (isLoading) return <Loading message="Loading notes..." />;
  if (!notes.length) return <ErrorPage message="not found page"/>;

  // Filter 
  const filteredNotes = notes
    .filter((n) => {
      const matchesCategory = selectedCategory === "All" || n.category === selectedCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredNotes.map((note) => (
        <div
          key={note._id}
          className="relative bg-[#0b1220] text-white p-6  rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.03] border border-[#122036]"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                 {note.title.length > 100 ? note.title.slice(0, 100) + "..." : note.title}
                </h3>
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

            {/* Icons */}
            <div className="flex items-center gap-2">
              {/* Pin */}
              <button
                onClick={() =>
                  pinMutation.mutate({ id: note._id, pinned: !note.pinned })
                }
                className="p-2 hover:bg-[#1a2335] rounded-full transition"
                title={note.pinned ? "Unpin" : "Pin"}
              >
                {note.pinned ? (
                  <Pin className="h-5 w-5 text-yellow-400" />
                ) : (
                  <PinOff className="h-5 w-5 text-gray-400" />
                )}
              </button>

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
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#273453] text-sm"
                    >
                      <Eye className="h-4 w-4 text-blue-400" /> View
                    </button>
                    <button
                      onClick={() => navigate(`/update/${note._id}`)}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#273453] text-sm"
                    >
                      <Edit2 className="h-4 w-4 text-yellow-400" /> Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(note._id)}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#273453] text-sm text-red-400"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

         
          <p className="text-gray-300 mb-3">
            {note.content.length > 160 ? note.content.slice(0, 160) + "..." : note.content}
          </p>

          <div className="flex gap-2 mt-2">
            <Button
              icon={<Eye />}
              label="View"
              className="p-button-outlined bg-gray-900 hover:bg-gray-700 p-2 rounded-2xl"
              onClick={() => navigate(`/note/${note._id}`)}
            />
            <Button
              icon={<Edit2 />}
              label="Edit"
              className="p-button-outlined bg-gray-900 hover:bg-gray-700 p-2 rounded-2xl "
              onClick={() => navigate(`/update/${note._id}`)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
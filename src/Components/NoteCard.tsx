// src/components/NoteCard.tsx
import React from "react";
import { Button } from "primereact/button";
import { Eye, Edit2 } from "lucide-react";
import type { Note } from "../data/mockNotes";

type Props = {
  note: Note;
};

export const NoteCard: React.FC<Props> = ({ note }) => {
  return (
    <div className="bg-[#050505] text-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-[1.02] border border-[#122036]">
      <div className="flex justify-between items-start gap-4 mb-3">
        <div>
          <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
          <div className="flex items-center gap-3 text-sm">
            <span className="px-3 py-1 bg-[#0b513b] rounded-full text-xs font-medium"> {note.category} </span>
            <span className="text-gray-400">{note.createdAt}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-300 mb-6">
        {note.summary.length > 160 ? note.summary.slice(0, 160) + "..." : note.summary}
      </p>

      <div className="flex gap-3">
        <Button
          icon={<Eye className="h-4 w-4" />}
          label="View"
          className="p-button-outlined p-button-secondary"
        />
        <Button
          icon={<Edit2 className="h-4 w-4" />}
          label="Edit"
          className="p-button-outlined"
        />
      </div>
    </div>
  );
};

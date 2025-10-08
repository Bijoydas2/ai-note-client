// src/data/mockNotes.ts
export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string; // keep simple
  summary: string;
}

export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Project Planning Meeting",
    content:
      "Discussed the upcoming product launch timeline and assigned responsibilities to team members. Key deliverables include market research, design mockups, and technical specifications.",
    category: "Work",
    createdAt: "1/14/2024",
    summary:
      "Meeting notes covering product launch planning and team assignments.",
  },
  {
    id: "2",
    title: "Weekend Trip Ideas",
    content:
      "Researching potential destinations for the upcoming long weekend. Considering mountain hiking, beach relaxation, or city exploration options.",
    category: "Personal",
    createdAt: "1/13/2024",
    summary: "Travel planning notes for weekend getaway options.",
  },
  {
    id: "3",
    title: "App Feature Brainstorm",
    content:
      "New feature ideas for the mobile app: dark mode, offline sync, voice notes, collaborative editing, and AI-powered search functionality.",
    category: "Ideas",
    createdAt: "1/12/2024",
    summary: "Creative brainstorming session for mobile app enhancements.",
  },
  {
    id: "4",
    title: "Book Notes: Atomic Habits",
    content:
      "Key takeaways from James Clear's book on habit formation. The 1% better principle, habit stacking, and environment design for success.",
    category: "Personal",
    createdAt: "1/11/2024",
    summary: "Summary of key concepts from Atomic Habits book.",
  },
  {
    id: "5",
    title: "Book Notes: Atomic Habits",
    content:
      "Key takeaways from James Clear's book on habit formation. The 1% better principle, habit stacking, and environment design for success.",
    category: "Personal",
    createdAt: "1/11/2024",
    summary: "Summary of key concepts from Atomic Habits book.",
  },
  {
    id: "6",
    title: "Book Notes: Atomic Habits",
    content:
      "Key takeaways from James Clear's book on habit formation. The 1% better principle, habit stacking, and environment design for success.",
    category: "Personal",
    createdAt: "1/11/2024",
    summary: "Summary of key concepts from Atomic Habits book.",
  },
  {
    id: "7",
    title: "Book Notes: Atomic Habits",
    content:
      "Key takeaways from James Clear's book on habit formation. The 1% better principle, habit stacking, and environment design for success.",
    category: "Personal",
    createdAt: "1/11/2024",
    summary: "Summary of key concepts from Atomic Habits book.",
  },
];

export interface Note {
  _id: string;       // MongoDB থেকে আসবে
  title: string;
  summary: string;
  content: string;
  category: string;
  createdAt: string; // ISO date string
}

// ==========================================================
// 6.12. Стан запитів: помилки та завантаження / Loader
// ==========================================================
// Щоб протестувати завантаження (app/notes/loading.tsx), додамо штучну паузу у getNotes (lib/api.ts)
// ----------------------------------------------------------
//
// lib/api.ts

import axios from "axios";

export type Note = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteListResponse = {
  notes: Note[];
  total: number;
};

axios.defaults.baseURL = "https://next-v1-notes-api.goit.study";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getNotes = async () => {
  await delay(2000);
  const res = await axios.get<NoteListResponse>("/notes");
  return res.data;
};

// ==========================================================
// 6.13.3 Динамічні маршрути / Отримання id з URL
// ==========================================================
// Додамо функцію getSingleNote: // lib/api.ts
// ----------------------------------------------------------
// lib/api.ts

export const getSingleNote = async (id: string) => {
  const res = await axios.get<Note>(`/notes/${id}`);
  return res.data;
};

// ==========================================================
//  6.10. Початок роботи з API / HTTP-запити
// ==========================================================
//
// src/lib/api.ts

// import axios from "axios";

// export type Note = {
//   id: string;
//   title: string;
//   content: string;
//   categoryId: string;
//   userId: string;
//   createdAt: string;
//   updatedAt: string;
// };

// export type NoteListResponse = {
//   notes: Note[];
//   total: number;
// };

// axios.defaults.baseURL = "https://next-v1-notes-api.goit.study";

// export const getNotes = async () => {
//   const res = await axios.get<NoteListResponse>("/notes");
//   return res.data;
// };

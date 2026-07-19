// =============================================================
/* api.ts - Глобальний експорт зовнішніх функцій та типів роботи з API */
// =============================================================

import axios from "axios";
import type { AxiosResponse } from "axios";
import { Note, CreateNoteData } from "@/types/note";

// =========================================================
// Загальні константи блоку

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const baseURL = "https://notehub-public.goit.study/api";

// =========================================================
// Інтерфейси для отримання списку нотаток та їх параметрів

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page: number;
  perPage: number; // Число має приходити динамічно (передаємо 10)
  search?: string;
}

// =============================================
// Екземпляр клієнта Axios

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// =============================================
// Функція створення нової нотатки

export async function createNote(noteData: CreateNoteData): Promise<Note> {
  const { data } = await apiClient.post<Note>("/notes", noteData);
  return data;
}

// =============================================
// Функція видалення нотатки за її ID

export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await apiClient.delete<Note>(`/notes/${id}`);
  return response.data;
}

// =============================================
// Функція отримання списку нотаток

export async function fetchNotes({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await apiClient.get<FetchNotesResponse>(
    "/notes",
    {
      /* Передаємо чисті параметри, які прийшли з Notes.client.tsx та page.tsx */
      params: { page, perPage, search: search || undefined },
    },
  );

  return response.data;
}

// =============================================
// Функція отримання детальної інформації про нотатку за її ID
export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await apiClient.get<Note>(`/notes/${id}`);
  return data;
}

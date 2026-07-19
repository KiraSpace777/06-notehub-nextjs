import { apiClient } from "./apiClient";
import { Note } from "@/types/note";

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await apiClient.get<Note>(`/notes/${id}`);
  return data;
}

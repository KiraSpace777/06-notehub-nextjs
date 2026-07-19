import { apiClient } from "./apiClient";
import { Note, CreateNoteData } from "@/types/note";

export async function createNote(noteData: CreateNoteData): Promise<Note> {
  const { data } = await apiClient.post<Note>("/notes", noteData);
  return data;
}

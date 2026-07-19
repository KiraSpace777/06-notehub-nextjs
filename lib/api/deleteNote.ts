import type { AxiosResponse } from "axios";
import { apiClient } from "./apiClient";
import type { Note } from "@/types/note";

export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await apiClient.delete<Note>(`/notes/${id}`);
  return response.data;
}

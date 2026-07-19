import type { AxiosResponse } from "axios";
import { apiClient } from "./apiClient";
import type { Note } from "@/types/note";

export interface FetchNotesParams {
  page: number;
  perPage: number; // Число має приходити динамічно (передаємо 10)
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

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

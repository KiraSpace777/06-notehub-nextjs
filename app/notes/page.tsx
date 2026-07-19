// ==========================================================
// Notes  (сторінка списку нотаток) - розмітка сторінки
// SSR (Server-Side Rendering)
// ==========================================================
// Отримання списку нотатків у серверний компонент
// +  npm install use-debounce
// +  npm install @tanstack/react-query
//
// Весь вміст компонента App з попередньої ДЗ перенесено на
// сторінку "/notes", взято з HW-05 вміст компонента "App.tsx"
// ----------------------------------------------------------
// app/notes/page.tsx

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function NotesPage({ searchParams }: PageProps) {
  // Тестування помилки:
  // throw new Error("Error message");

  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const searchTerm = resolvedParams.search || "";

  const queryClient = new QueryClient();

  /* Серверне попереднє завантаження кешу даних (Prefetch) перед рендерингом сторінки */
  await queryClient.prefetchQuery({
    queryKey: ["notes", currentPage, searchTerm],
    queryFn: () => fetchNotes({ page: currentPage, perPage: 10, search: searchTerm }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={currentPage} initialSearch={searchTerm} />
    </HydrationBoundary>
  );
}

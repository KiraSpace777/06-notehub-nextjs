// ==========================================================
// NoteDetails (серверний компонент)
// - Динамічні маршрути / Prefetch, кешування, dehydrate
// ==========================================================
// Структура:
// -------------------------
// app/notes/[id]/page.tsx – залишаємо page.tsx серверним
// app/notes/[id]/NoteDetails.client.tsx – створюємо окремий клієнтський компонент для інтерактивного вмісту
// ----------------------------------------------------------
// До серверного компонента "app/notes/[id]/page.tsx" повертаємо логіку читання ідентифікатора із параметрів та додамо (prefetch), щоб компонент завантажував дані заздалегідь.
// Для того, щоб використати ці дані в клієнтському компоненті, необхідно використати HydrationBoundary із React Query
// ----------------------------------------------------------
// app/notes/[id]/page.tsx
//

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const queryClient = new QueryClient();

  /* Попереднє завантаження деталей однієї конкретної нотатки на сервері */
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

// ==========================================================
// NoteDetails - Динамічні маршрути / Prefetch, кешування, dehydrate
// ==========================================================
// до серверного компонента app/notes/[id]/page.tsx повертаємо логіку читання ідентифікатора із параметрів. Також додамо код, щоб компонент завантажував дані заздалегідь (prefetch):
// *** prefetchQuery – функція, яка завчасно завантажить нам ці нотатки та збереже їх у кеш на сервері. Завдяки цьому при виклику useQuery у клієнтському компоненті, дані вже будуть доступні – без повторного запиту.
// *** queryKey – ключ, за яким дані будуть збережені у кеш
// *** queryFn – функція HTTP-запиту

// Для того, щоб використати ці дані в клієнтському компоненті, необхідно використати HydrationBoundary із React Query:
// *** HydrationBoundary – компонент, передає кеш клієнту
// *** dehydrate(queryClient) – перетворює кеш у серіалізований обʼєкт

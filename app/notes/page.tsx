// ==========================================================
// Notes  (сторінка списку нотаток) - розмітка сторінки
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

// =================================
// import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
// import { fetchNotes } from "@/lib/api";
// import NotesClient from "./Notes.client";

// // import "./NotesPage.module.css";

// interface PageProps {
//   searchParams: Promise<{ page?: string; search?: string }>;
// }

// export default async function NotesPage({ searchParams }: PageProps) {
//   const resolvedParams = await searchParams;
//   const currentPage = Number(resolvedParams.page) || 1;
//   const searchTerm = resolvedParams.search || "";

//   const queryClient = new QueryClient();

//   /* Серверне попереднє завантаження кешу даних (Prefetch) перед рендером сторінки */
//   await queryClient.prefetchQuery({
//     queryKey: ["notes", currentPage, searchTerm],
//     /* ВИПРАВЛЕНО: Передаємо параметри об'єктом FetchNotesParams відповідно до типів API */
//     queryFn: () => fetchNotes({ page: currentPage, perPage: 6, search: searchTerm }),
//   });

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <NotesClient initialPage={currentPage} initialSearch={searchTerm} />
//     </HydrationBoundary>
//   );
// }

// ====================================================
// import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
// import { fetchNotes } from "@/lib/api";
// import NotesClient from "./Notes.client";

// interface PageProps {
//   searchParams: Promise<{ page?: string; search?: string }>;
// }

// export default async function NotesPage({ searchParams }: PageProps) {
//   const resolvedParams = await searchParams;
//   const currentPage = Number(resolvedParams.page) || 1;
//   const searchTerm = resolvedParams.search || "";

//   const queryClient = new QueryClient();

//   // Виконуємо prefetch даних на сервері за ключем запиту
//   await queryClient.prefetchQuery({
//     queryKey: ["notes", currentPage, searchTerm],
//     queryFn: () => fetchNotes(currentPage, searchTerm),
//   });

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <NotesClient initialPage={currentPage} initialSearch={searchTerm} />
//     </HydrationBoundary>
//   );
// }
// ============================================================

// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useDebouncedCallback } from "use-debounce";

// import { fetchNotes, type FetchNotesResponse } from "@/lib/api/";
// import NoteList from "@/components/NoteList/NoteList";
// import Pagination from "@/components/Pagination/Pagination";
// import Modal from "@/components/Modal/Modal";
// import NoteForm from "@/components/NoteForm/NoteForm";
// import SearchBox from "@/components/SearchBox/SearchBox";
// import Loader from "@/components/Loader/Loader";
// import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

// import type { Note } from "@/types/note";
// import css from "./NotesPage.module.css";

// // ГРАФІЧНІ ТА ІНФОРМАЦІЙНІ КОНСТАНТИ
// const DEBOUNCE_DELAY_MS = 2000;
// const STALE_TIME_MS = 5000;

// export default function App() {
//   const [page, setPage] = useState<number>(1);
//   const [perPage] = useState<number>(10);
//   const [search, setSearch] = useState<string>("");
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

//   const { data, isLoading, isError, isFetching } = useQuery<FetchNotesResponse, Error>({
//     queryKey: ["notes", { page, perPage, search }],
//     queryFn: () => fetchNotes({ page, perPage, search }),
//     staleTime: STALE_TIME_MS,
//   });
//   // staleTime
//   // Дані вважаються «актуальними»/новими (fresh) протягом STALE_TIME_MS після їх успішного отримання з сервера NoteHub. Якщо користувач протягом цих секунд виконає будь-яку дію, бібліотека не буде робити новий мережевий запит. Вона миттєво віддасть дані з локального кешу.Як тільки "STALE_TIME_MS" секунди минають, дані автоматично переходять у статус «застарілих» (stale). Тепер при будь-якій зміні фокусу екрана React Query запустить новий фоновий запит (isFetching), щоб перевірити, чи не змінилося щось на сервері

//   // Затримка у 2000мс на відправлення запиту до сервера
//   const debouncedSetSearch = useDebouncedCallback((value: string): void => {
//     setSearch(value);
//     setPage(1);
//   }, DEBOUNCE_DELAY_MS);

//   if (isLoading) return <Loader />;
//   if (isError) return <ErrorMessage />;

//   const notesList: Note[] = data?.notes ?? [];
//   const totalPages: number = data?.totalPages ?? 0;

//   return (
//     <div className={css.app}>
//       <header className={css.toolbar}>
//         {/* key={search} скидає внутрішній стан інпуту автоматично після дебаунсу */}
//         <SearchBox key={search} onSearchChange={debouncedSetSearch} />
//         {totalPages > 1 && (
//           <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />
//         )}
//         <button type="button" className={css.button} onClick={() => setIsModalOpen(true)}>
//           Create note +
//         </button>
//       </header>

//       <main className={isFetching ? css.contentLoading : css.mainContent}>
//         {notesList.length > 0 ? (
//           <NoteList notes={notesList} />
//         ) : (
//           /* Повідомлення про порожній результат пошуку */
//           <p className={css.notFoundText}>
//             No notes found
//             {search.trim() ? (
//               <>
//                 {" "}
//                 on your search query:{" "}
//                 <strong>
//                   `<u>{search.trim()}</u>`
//                 </strong>
//                 , try new search query
//               </>
//             ) : (
//               ""
//             )}
//           </p>
//         )}
//       </main>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <NoteForm onClose={() => setIsModalOpen(false)} />
//       </Modal>
//     </div>
//   );
// }

// ==========================================================
// Notes - розмітка сторінки
// ==========================================================
// Отримання списку нотатків у серверний компонент
// ----------------------------------------------------------
// app/notes/page.tsx

// import NoteList from "@/components/NoteList/NoteList";
// import { getNotes } from "@/lib/api";

// const Notes = async () => {
//   const response = await getNotes();

//   return (
//     <section>
//       <h1>Notes List</h1>
//       {response?.notes?.length > 0 && <NoteList notes={response.notes} />}
//     </section>
//   );
// };

// export default Notes;

// ==========================================================
// 6.11. Директива 'use client' / отримання нотаток по кліку
// ==========================================================
//
// app/notes/page.tsx
// -----------------------------
// Крок 1. Робимо компонент сторінки Notes клієнтським
// "use client";
// -----------------------------
// Крок 2. Робимо рефакторинг коду після заміни виду рендерингу на клієнтський. Тепер ми можемо використовувати всі React-хуки й події, як у звичайному React, реалізуємо запит по кліку. Для цього:
// ------------------------------
// ** Робимо компонент звичайним синхронним, без async
// ** Додаємо стан через useState
// ** Додаємо у JSX кнопку
// ** Додаємо обробник події onClick
// ** У функції-обробнику виконуємо запит до API
// ** Зберігаємо відповідь у стан
// ** Виводимо список, якщо відповідь є
// -----------------------------
// Це приклад клієнтського рендерингу – CSR (Client-Side Rendering):
// HTML спочатку містить тільки базову структуру
// Дані підвантажуються вже в браузері
// Браузер показує результат після запиту
// ----------------------------------------------
// "use client";

// import { useState } from "react";
// import NoteList from "@/components/NoteList/NoteList";
// import { getNotes, Note } from "@/lib/api";

// const Notes = () => {
//   const [notes, setNotes] = useState<Note[]>([]);

//   const handleClick = async () => {
//     const response = await getNotes();
//     if (response?.notes) {
//       setNotes(response.notes);
//     }
//   };

//   return (
//     <section>
//       <h1>Notes List</h1>
//       <button onClick={handleClick}>Get my notes</button>
//       {notes.length > 0 && <NoteList notes={notes} />}
//     </section>
//   );
// };

// export default Notes;
// ----------------------------------------------

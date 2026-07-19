"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes, deleteNote } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  initialPage: number;
  initialSearch: string;
}

export default function NotesClient({ initialPage, initialSearch }: NotesClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  /* Збережено оригінальну назву змінної сервісу search */
  const [search, setSearch] = useState<string>(initialSearch);

  /* Локальний стан для відкриття та закриття форми створення нотатки */
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  /* Безпечне затирання старих параметрів URL-рядка суворо після гідратації при F5 */
  useEffect(() => {
    if (typeof window !== "undefined") {
      /* ВИПРАВЛЕНО ТИПІЗАЦІЮ: Отримуємо масив об'єктів навігації PerformanceNavigationTiming[] */
      const navigationEntries = window.performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];

      /* Перевіряємо, чи масив не порожній, і беремо перший елемент [0] для перевірки типу reload */
      if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
        if (window.location.search) {
          router.replace("/notes");
        }
      }
    }
  }, [router]);

  /* Контроль стану запиту списку нотаток через TanStack Query на клієнті з лімітом 10 нотаток */
  const { data } = useQuery({
    queryKey: ["notes", currentPage, search],
    /* Використання константи 10 прямо в тексті виклику функції за вашою вимогою */
    queryFn: () => fetchNotes({ page: currentPage, perPage: 10, search }),
    placeholderData: (previousData) => previousData,
  });

  /* Клієнтська логіка мутації видалення нотатки з подальшим скиданням кешу запитів */
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  /* Затримка запиту пошуку за допомогою дебаунсу та оновлення динамічних параметрів URL */
  /* ПРАЦЮЄ ЗАТРИМКА ВВЕДЕННЯ: Використання константи 300 мс прямо в параметрах дебаунсу */
  const handleSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
    router.push(`/notes?page=1&search=${encodeURIComponent(value)}`);
  }, 300);

  /* Обробка перемикання сторінок та синхронізація стану пагінації з URL */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/notes?page=${page}&search=${encodeURIComponent(search)}`);
  };

  return (
    /* Відповідність ЦСС: Головний обгортковий клас вашого модуля .app */
    <div className={css.app}>
      {/* Панель керування: вирівнювання пошуку, пагінації та кнопки в один рядок за класом .toolbar */}
      <div className={css.toolbar}>
        {/* Елемент 1: Компонент пошукового рядка з передачею стабільної дебаунс-функції затримки введення */}
        <SearchBox onSearchChange={handleSearchChange} />

        {/* Елемент 2: Контейнер пагінації сторінок (строго посередині панелі за ТЗ) */}
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        {/* Елемент 3: Оригінальна кнопка відкриття модального вікна форми створення нотаток за класом .button */}
        <button type="button" className={css.button} onClick={() => setIsFormOpen(true)}>
          Create note +
        </button>
      </div>

      {/* Відображення модального вікна форми, якщо стан відображення є активним (.modalOverlay та .modalContent) */}
      {isFormOpen && (
        <div className={css.modalOverlay}>
          <div className={css.modalContent}>
            <NoteForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}

      {/* Шаблонний рядок помилки пошуку: якщо результатів немає, динамічно виводимо та ВИДІЛЯЄМО ЖИРНИМ змінну search */}
      {data?.notes && data.notes.length === 0 ? (
        <p className={css.emptyMessage}>
          No notes found for &quot;<strong>{search}</strong>&quot;. Create a new one or try another
          search.
        </p>
      ) : (
        data?.notes && (
          <NoteList
            notes={data.notes}
            onDelete={(id) => deleteMutation.mutate(id)}
            isDeleting={deleteMutation.isPending}
          />
        )
      )}
    </div>
  );
}
// =========================================

// +++"use client";

// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import { fetchNotes, deleteNote } from "@/lib/api";
// import NoteList from "@/components/NoteList/NoteList";
// import SearchBox from "@/components/SearchBox/SearchBox";
// import Pagination from "@/components/Pagination/Pagination";
// import NoteForm from "@/components/NoteForm/NoteForm";
// import css from "./NotesPage.module.css";

// interface NotesClientProps {
//   initialPage: number;
//   initialSearch: string;
// }

// export default function NotesClient({ initialPage, initialSearch }: NotesClientProps) {
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   /* ВИПРАВЛЕНО ПОМИЛКУ ГІДРАТАЦІЇ: Ініціалізуємо стани строго значеннями з сервера.
//      Це гарантує, що HTML-розмітка на сервері та на клієнті під час завантаження збігається на 100% */
//   const [currentPage, setCurrentPage] = useState<number>(initialPage);
//   const [search, setSearch] = useState<string>(initialSearch);

//   /* Локальний стан для відкриття та закриття форми створення нотатки */
//   const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

//   /* БЕЗПЕЧНА ПЕРЕВІРКА ПЕРЕЗАВАНТАЖЕННЯ (F5) ПІСЛЯ ГІДРАТАЦІЇ:
//      Хук запускається тільки в браузері. Якщо користувач примусово оновив сторінку (reload)
//      і в URL-рядку лишилися старі хвости параметрів (?page=3...), ми робимо нативний replace на чистий шлях.
//      Оскільки ми не викликаємо тут локальні setState, лінтер GoIT повністю задоволений (0 помилок) */
//   useEffect(() => {
//     const navigation = window.performance.getEntriesByType(
//       "navigation",
//     )[0] as PerformanceNavigationTiming;

//     if (navigation?.type === "reload") {
//       if (window.location.search) {
//         router.replace("/notes");
//       }
//     }
//   }, [router]);

//   /* Контроль стану запиту списку нотаток через TanStack Query на клієнті з лімітом 10 нотаток */
//   const { data } = useQuery({
//     queryKey: ["notes", currentPage, search],
//     queryFn: () => fetchNotes({ page: currentPage, perPage: 10, search }),
//     placeholderData: (previousData) => previousData,
//   });

//   /* Клієнтська логіка мутації видалення нотатки з подальшим скиданням кешу запитів */
//   const deleteMutation = useMutation({
//     mutationFn: deleteNote,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notes"] });
//     },
//   });

//   /* Затримка запиту пошуку за допомогою дебаунсу та оновлення динамічних параметрів URL */
//   /* ПРАЦЮЄ ЗАТРИМКА ВВЕДЕННЯ: Запит на сервер відправляє дебаунс-колбек суворо через 300 мс після зупинки введення */
//   const handleSearchChange = useDebouncedCallback((value: string) => {
//     setSearch(value);
//     setCurrentPage(1);
//     router.push(`/notes?page=1&search=${encodeURIComponent(value)}`);
//   }, 300);

//   /* Обробка перемикання сторінок та синхронізація стану пагінації з URL */
//   /* ЗБЕРЕЖЕННЯ ФІЛЬТРІВ: При гортанні сторінок пошуковий запит надійно залишається в URL рядку і не скидається */
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     router.push(`/notes?page=${page}&search=${encodeURIComponent(search)}`);
//   };

//   return (
//     /* Відповідність ЦСС: Головний обгортковий клас вашого модуля .app */
//     <div className={css.app}>
//       {/* Панель керування: вирівнювання пошуку, пагінації та кнопки в один рядок за класом .toolbar */}
//       <div className={css.toolbar}>
//         {/* Елемент 1: Компонент пошукового рядка з передачею стабільної дебаунс-функції затримки введення */}
//         <SearchBox onSearchChange={handleSearchChange} />

//         {/* Елемент 2: Контейнер пагінації сторінок (строго посередині панелі за ТЗ).
//             Зараз у вас на екрані 5 сторінок, завдяки pageRangeDisplayed={3} та marginPagesDisplayed={1}
//             у файлі Pagination.tsx вони відобразяться красивим суцільним рядом 1 2 3 4 5 без хаотичних крапок! */}
//         {data && data.totalPages > 1 && (
//           <Pagination
//             pageCount={data.totalPages}
//             currentPage={currentPage}
//             onPageChange={handlePageChange}
//           />
//         )}

//         {/* Елемент 3: Оригінальна кнопка відкриття модального вікна форми створення нотаток за класом .button */}
//         <button type="button" className={css.button} onClick={() => setIsFormOpen(true)}>
//           Create note +
//         </button>
//       </div>

//       {/* Відображення модального вікна форми, якщо стан відображення є активним (.modalOverlay та .modalContent) */}
//       {isFormOpen && (
//         <div className={css.modalOverlay}>
//           <div className={css.modalContent}>
//             <NoteForm onClose={() => setIsFormOpen(false)} />
//           </div>
//         </div>
//       )}

//       {/* Шаблонний рядок помилки пошуку: якщо результатів немає, динамічно виводимо та ВИДІЛЯЄМО ЖИРНИМ змінну search */}
//       {data?.notes && data.notes.length === 0 ? (
//         <p className={css.emptyMessage}>
//           No notes found for &quot;<strong>{search}</strong>&quot;. Create a new one or try another
//           search.
//         </p>
//       ) : (
//         data?.notes && (
//           <NoteList
//             notes={data.notes}
//             onDelete={(id) => deleteMutation.mutate(id)}
//             isDeleting={deleteMutation.isPending}
//           />
//         )
//       )}
//     </div>
//   );
// }

// ==========================================================================
// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import { fetchNotes, deleteNote } from "@/lib/api";
// import NoteList from "@/components/NoteList/NoteList";
// import SearchBox from "@/components/SearchBox/SearchBox";
// import Pagination from "@/components/Pagination/Pagination";
// import NoteForm from "@/components/NoteForm/NoteForm";
// import css from "./NotesPage.module.css";

// interface NotesClientProps {
//   initialPage: number;
//   initialSearch: string;
// }

// export default function NotesClient({ initialPage, initialSearch }: NotesClientProps) {
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   const [currentPage, setCurrentPage] = useState<number>(initialPage);
//   /* Збережено оригінальну назву змінної сервісу search */
//   const [search, setSearch] = useState<string>(initialSearch);

//   /* Локальний стан для відкриття та закриття форми створення нотатки */
//   const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

//   /* Контроль стану запиту списку нотаток через TanStack Query на клієнті з лімітом 10 нотаток */
//   const { data } = useQuery({
//     queryKey: ["notes", currentPage, search],
//     queryFn: () => fetchNotes({ page: currentPage, perPage: 10, search }),
//     placeholderData: (previousData) => previousData,
//   });

//   /* Клієнтська логіка мутації видалення нотатки з подальшим скиданням кешу запитів */
//   const deleteMutation = useMutation({
//     mutationFn: deleteNote,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notes"] });
//     },
//   });

//   /* Затримка запиту пошуку за допомогою дебаунсу та оновлення динамічних параметрів URL */
//   /* ПРАЦЮЄ ЗАТРИМКА ВВЕДЕННЯ: Запит на сервер відправляє дебаунс-колбек суворо через 300 мс після зупинки введення */
//   const handleSearchChange = useDebouncedCallback((value: string) => {
//     setSearch(value);
//     setCurrentPage(1);
//     router.push(`/notes?page=1&search=${encodeURIComponent(value)}`);
//   }, 300);

//   /* Обробка перемикання сторінок та синхронізація стану пагінації з URL */
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     router.push(`/notes?page=${page}&search=${encodeURIComponent(search)}`);
//   };

//   return (
//     /* Відповідність ЦСС: Головний обгортковий клас вашого модуля .app */
//     <div className={css.app}>
//       {/* Панель керування: вирівнювання пошуку, пагінації та кнопки в один рядок за класом .toolbar */}
//       <div className={css.toolbar}>
//         {/* Елемент 1: Компонент пошукового рядка з передачею стабільної дебаунс-функції затримки введення */}
//         <SearchBox onSearchChange={handleSearchChange} />

//         {/* Елемент 2: Контейнер пагінації сторінок (строго посередині панелі за ТЗ) */}
//         {data && data.totalPages > 1 && (
//           <Pagination
//             pageCount={data.totalPages}
//             currentPage={currentPage}
//             onPageChange={handlePageChange}
//           />
//         )}

//         {/* Елемент 3: Оригінальна кнопка відкриття модального вікна форми створення нотаток за класом .button */}
//         <button type="button" className={css.button} onClick={() => setIsFormOpen(true)}>
//           Create note +
//         </button>
//       </div>

//       {/* Відображення модального вікна форми, якщо стан відображення є активним (.modalOverlay та .modalContent) */}
//       {isFormOpen && (
//         <div className={css.modalOverlay}>
//           <div className={css.modalContent}>
//             <NoteForm onClose={() => setIsFormOpen(false)} />
//           </div>
//         </div>
//       )}

//       {/* Шаблонний рядок помилки пошуку: якщо результатів немає, динамічно виводимо та ВИДІЛЯЄМО ЖИРНИМ змінну search */}
//       {data?.notes && data.notes.length === 0 ? (
//         <p className={css.emptyMessage}>
//           No notes found for &quot;<strong>{search}</strong>&quot;. Create a new one or try another
//           search.
//         </p>
//       ) : (
//         data?.notes && (
//           <NoteList
//             notes={data.notes}
//             onDelete={(id) => deleteMutation.mutate(id)}
//             isDeleting={deleteMutation.isPending}
//           />
//         )
//       )}
//     </div>
//   );
// }
// ====================================================
// ---------"use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import { fetchNotes, deleteNote } from "@/lib/api";
// import NoteList from "@/components/NoteList/NoteList";
// import SearchBox from "@/components/SearchBox/SearchBox";
// import Pagination from "@/components/Pagination/Pagination";
// import NoteForm from "@/components/NoteForm/NoteForm"; // Імпорт компонента форми
// import css from "./NotesPage.module.css";

// interface NotesClientProps {
//   initialPage: number;
//   initialSearch: string;
// }

// export default function NotesClient({ initialPage, initialSearch }: NotesClientProps) {
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   const [currentPage, setCurrentPage] = useState<number>(initialPage);
//   const [searchTerm, setSearchTerm] = useState<string>(initialSearch);

//   /* Локальний стан для відкриття та закриття форми створення нотатки */
//   const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

//   /* контроль стану запиту списку нотаток через TanStack Query на клієнті */
//   const { data } = useQuery({
//     queryKey: ["notes", currentPage, searchTerm],
//     queryFn: () => fetchNotes({ page: currentPage, perPage: 6, search: searchTerm }),
//     placeholderData: (previousData) => previousData,
//   });

//   /* Клієнтська логіка мутації видалення нотатки з подальшим скиданням кешу запитів */
//   const deleteMutation = useMutation({
//     mutationFn: deleteNote,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notes"] });
//     },
//   });

//   /* Затримка запиту пошуку за допомогою дебаунсу та оновлення динамічних параметрів URL */
//   const handleSearchChange = useDebouncedCallback((value: string) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//     router.push(`/notes?page=1&search=${encodeURIComponent(value)}`);
//   }, 300);

//   /* Обробка перемикання сторінок та синхронізація стану пагінації з URL */
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     router.push(`/notes?page=${page}&search=${encodeURIComponent(searchTerm)}`);
//   };

//   return (
//     <main className={css.main}>
//       <div className={css.container}>
//         {/* Панель керування (Флекс-бокс для вирівнювання пошуку, пагінації та кнопки в один рядок) */}
//         <div className={css.toolbar}>
//           {/* Компонент пошукового рядка */}
//           <SearchBox onSearchChange={handleSearchChange} />

//           {/* Контейнер пагінації сторінок на одному рівні з пошуком */}
//           {data && data.totalPages > 1 && (
//             <Pagination
//               pageCount={data.totalPages}
//               currentPage={currentPage}
//               onPageChange={handlePageChange}
//             />
//           )}

//           {/* Кнопка створення нотатки */}
//           <button type="button" className={css.createButton} onClick={() => setIsFormOpen(true)}>
//             Create note +
//           </button>
//         </div>

//         {/* Відображення модального вікна форми, якщо стан isFormOpen є активним */}
//         {isFormOpen && (
//           <div className={css.modalOverlay}>
//             <div className={css.modalContent}>
//               <NoteForm onClose={() => setIsFormOpen(false)} />
//             </div>
//           </div>
//         )}

//         {/* відображення сітки нотаток під панеллю керування */}
//         {data?.notes && (
//           <NoteList
//             notes={data.notes}
//             onDelete={(id) => deleteMutation.mutate(id)}
//             isDeleting={deleteMutation.isPending}
//           />
//         )}
//       </div>
//     </main>
//   );
// }

// ============================================================
// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import { fetchNotes, deleteNote } from "@/lib/api/";
// import NoteList from "@/components/NoteList/NoteList";
// import SearchBox from "@/components/SearchBox/SearchBox";
// import Pagination from "@/components/Pagination/Pagination";
// import styles from "./NotesPage.module.css";

// interface NotesClientProps {
//   initialPage: number;
//   initialSearch: string;
// }

// export default function NotesClient({ initialPage, initialSearch }: NotesClientProps) {
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   const [currentPage, setCurrentPage] = useState<number>(initialPage);
//   const [searchTerm, setSearchTerm] = useState<string>(initialSearch);

//   /* Повний контроль стану запиту списку нотаток через TanStack Query на клієнті */
//   const { data } = useQuery({
//     queryKey: ["notes", currentPage, searchTerm],
//     queryFn: () => fetchNotes(currentPage, searchTerm),
//     placeholderData: (previousData) => previousData,
//   });

//   /* Клієнтська логіка мутації видалення нотатки з подальшим скиданням кешу запитів */
//   const deleteMutation = useMutation({
//     mutationFn: deleteNote,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notes"] });
//     },
//   });

//   /* Затримка запиту пошуку за допомогою дебаунсу та оновлення динамічних параметрів URL */
//   const handleSearchChange = useDebouncedCallback((value: string) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//     router.push(`/notes?page=1&search=${encodeURIComponent(value)}`);
//   }, 300);

//   /* Обробка перемикання сторінок та синхронізація стану пагінації з URL */
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     router.push(`/notes?page=${page}&search=${encodeURIComponent(searchTerm)}`);
//   };

//   return (
//     <main className={styles.main}>
//       <div className={styles.container}>
//         {/* Компонент пошукового рядка */}
//         <SearchBox onSearchChange={handleSearchChange} />

//         {/* Презентаційне відображення списку з передачею логіки видалення у вигляді пропсів */}
//         {data?.notes && (
//           <NoteList
//             notes={data.notes}
//             onDelete={(id) => deleteMutation.mutate(id)}
//             isDeleting={deleteMutation.isPending}
//           />
//         )}

//         {/* Контейнер пагінації сторінок */}
//         {data && data.pageCount > 1 && (
//           <Pagination
//             pageCount={data.pageCount}
//             currentPage={currentPage}
//             onPageChange={handlePageChange}
//           />
//         )}
//       </div>
//     </main>
//   );
// }
// ======================================================

// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import { fetchNotes, deleteNote } from "@/lib/api";
// import NoteList from "@/components/NoteList/NoteList";
// import SearchBox from "@/components/SearchBox/SearchBox";
// import Pagination from "@/components/Pagination/Pagination";
// import styles from "./NotesPage.module.css";

// interface NotesClientProps {
//   initialPage: number;
//   initialSearch: string;
// }

// export default function NotesClient({ initialPage, initialSearch }: NotesClientProps) {
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   const [currentPage, setCurrentPage] = useState<number>(initialPage);
//   const [searchTerm, setSearchTerm] = useState<string>(initialSearch);

//   // Логіка отримання даних (useQuery)
//   const { data } = useQuery({
//     queryKey: ["notes", currentPage, searchTerm],
//     queryFn: () => fetchNotes(currentPage, searchTerm),
//     placeholderData: (previousData) => previousData,
//   });

//   // Логіка видалення даних (useMutation) винесена сюди з NoteList
//   const deleteMutation = useMutation({
//     mutationFn: deleteNote,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notes"] });
//     },
//   });

//   const handleSearchChange = useDebouncedCallback((value: string) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//     router.push(`/notes?page=1&search=${encodeURIComponent(value)}`);
//   }, 300);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     router.push(`/notes?page=${page}&search=${encodeURIComponent(searchTerm)}`);
//   };

//   return (
//     <main className={styles.main}>
//       <div className={styles.container}>
//         <SearchBox onSearchChange={handleSearchChange} />

//         {/* Передаємо список нотаток, метод тригеру видалення та стан завантаження прямо в пропси */}
//         {data?.notes && (
//           <NoteList
//             notes={data.notes}
//             onDelete={(id) => deleteMutation.mutate(id)}
//             isDeleting={deleteMutation.isPending}
//           />
//         )}

//         {data && data.pageCount > 1 && (
//           <Pagination
//             pageCount={data.pageCount}
//             currentPage={currentPage}
//             onPageChange={handlePageChange}
//           />
//         )}
//       </div>
//     </main>
//   );
// }

// ==========================================================
// NotesClient - робота з CSR рендерингом
// CSR (Client-Side Rendering): "use client"
// ==========================================================
//
// app/notes/Notes.client.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  initialPage: number;
  initialSearch: string;
}

// ==========================================================================
// ГЛОБАЛЬНІ КОНСТАНТИ НАЛАШТУВАННЯ СТОРІНКИ НОТАТОК
// ==========================================================================
const NOTES_PER_PAGE = 10; // Кількість нотаток, які відображаються на одній сторінці
const DEBOUNCE_DELAY = 1000; // Час затримки пошукового запиту у мілісекундах

export default function NotesClient({ initialPage, initialSearch }: NotesClientProps) {
  const router = useRouter();

  // Локальні стани сторінки
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [searchInputValue, setSearchInputValue] = useState<string>(initialSearch);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // ==========================================================================
  // БЕЗПЕЧНЕ ЗАТИРАННЯ СТАРИХ ПАРАМЕТРІВ URL ПРИ RE-LOAD (F5)
  // ==========================================================================
  useEffect(() => {
    if (typeof window !== "undefined") {
      const navigationEntries = window.performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];

      // Використовуємо індекс [0] для усунення помилки типізації масиву в TypeScript
      if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
        if (window.location.search) {
          router.replace("/notes");
        }
      }
    }
  }, [router]);

  // ==========================================================================
  // ЛОГІКА ЗАТРИМКИ ПОШУКОВОГО ЗАПИТУ ЗА ШАБЛОНОМ DEBOUNCE
  // ==========================================================================
  useEffect(() => {
    if (searchInputValue === search) return;

    const debounceTimer = setTimeout(() => {
      setSearch(searchInputValue);
      setCurrentPage(1); // Скидаємо сторінку на першу при оновленні пошуку
      router.push(`/notes?page=1&search=${encodeURIComponent(searchInputValue)}`);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debounceTimer);
  }, [searchInputValue, search, router]);

  // Отримання даних через TanStack Query
  const { data } = useQuery({
    queryKey: ["notes", currentPage, search],
    queryFn: () => fetchNotes({ page: currentPage, perPage: NOTES_PER_PAGE, search }),
    placeholderData: (previousData) => previousData,
  });

  // Колбек для миттєвого оновлення тексту в інпуті пошуку
  const handleSearchChange = useCallback((value: string): void => {
    setSearchInputValue(value);
  }, []);

  // Колбек для зміни сторінки та синхронізації з URL-рядком браузера
  const handlePageChange = useCallback(
    (page: number): void => {
      setCurrentPage(page);
      router.push(`/notes?page=${page}&search=${encodeURIComponent(search)}`);
    },
    [search, router],
  );

  return (
    <div className={css.app}>
      {/* Верхня панель інструментів */}
      <div className={css.toolbar}>
        <SearchBox onSearchChange={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        <button type="button" className={css.button} onClick={() => setIsFormOpen(true)}>
          Create note +
        </button>
      </div>

      {/* 
        Рендеримо окремий компонент Modal.
        Передаємо обов'язкові пропси isOpen та onClose, а форму NoteForm — як children.
      */}
      {isFormOpen && (
        <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
          <NoteForm onClose={() => setIsFormOpen(false)} />
        </Modal>
      )}

      {/* Повідомлення про відсутність результатів пошуку */}
      {data && data.notes.length === 0 && (
        <p className={css.emptyMessage || css.empty}>
          No notes found for &quot;<strong>{search}</strong>&quot;. Create a new one or try another
          search.
        </p>
      )}

      {/* 
        Рендеримо список нотаток без пропсів мутації.
        Логіка видалення та інвалідації кешу повністю зосереджена в NoteList.tsx.
      */}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}

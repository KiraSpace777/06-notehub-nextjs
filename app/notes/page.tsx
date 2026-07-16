// ==========================================================
// 6.12. Стан запитів: помилки та завантаження /
// Повернемо логіку отримання списку нотатків
// у серверний компонент:
// ==========================================================
import NoteList from "@/components/NoteList/NoteList";
import { getNotes } from "@/lib/api";

const Notes = async () => {
  const response = await getNotes();

  return (
    <section>
      <h1>Notes List</h1>
      {response?.notes?.length > 0 && <NoteList notes={response.notes} />}
    </section>
  );
};

export default Notes;

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
// ==========================================================
// 6.10. Початок роботи з API / Список нотатків
// ==========================================================
// ---------------------------------------------------------
// app/notes/page.tsx
// ---------------------------------------------------------
// import { getNotes } from "@/lib/api";
// // 1. Імпортуємо NoteList із : components/NoteList/NoteList.tsx
// import NoteList from "@/components/NoteList/NoteList";

// // 2. Робимо рефакторинг асинхронної функції
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
// ---------------------------------------------------------
// Сторінка рендериться вже з готовим HTML-контентом, який прийшов із бекенду.
// У вихідному коді сторінки (view-source) вже присутні всі заголовки нотаток.
// Немає ніяких спалахів завантаження – користувач одразу бачить дані.

// Це все завдяки SSR – і саме в цьому полягає перевага Next.js перед звичайним SPA.

// ==========================================================
// 6.10. Початок роботи з API
// ==========================================================
//
// app/notes/page.tsx

// // 1. Імпортуємо функцію
// import { getNotes } from "@/lib/api";

// // 2. Робимо функцію асинхронною
// const Notes = async () => {
//   // 3. Виконуємо запит
//   const notes = await getNotes();
//   console.log("notes", notes);
//   return <div>Notes page</div>;
// };

// export default Notes;

// ==========================================================
// 6.5. Створення сторінок
// ==========================================================

// app/notes/page.tsx

// const Notes = () => {
//   return <div>Notes</div>;
// };
// export default Notes;

// --------------------------------------
// http://localhost:3000/notes
// --------------------------------------
// export default function Notes() {
//   return <div>Notes</div>;
// }

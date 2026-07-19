// ==========================================================
// Локальна перевірка помилок завантаження: app/notes
// ==========================================================
// error.tsx обов'язково має бути клієнтським ("use client"). Файли помилок у Next.js працюють як React Error Boundaries. Вони мають вміти перехоплювати помилки як на сервері, так і на клієнті, а також містять клієнтську функцію reset() для спроби повторного завантаження сторінки без повного перезавантаження браузера.
// ------------------------------------------------
// app/notes/[id]/error.tsx

"use client";

import css from "../error.module.css";

type Props = {
  error: Error;
  reset: () => void;
};

export default function NotesError({ error }: Props) {
  return <p className={css.text}>Could not fetch note details. {error.message}</p>;
}

// ==========================================================
// 6.13 Динамічні маршрути / Навігація на сторінку нотатки
// ==========================================================
// 6.13.4 - Навігація на сторінку нотатки: нам потрібно у компоненті NoteItem.tsx додати логіку навігації, за допомогою Link
// ----------------------------------------------------------
//
// components/NoteItem/NoteItem.tsx

import Link from "next/link";
import { Note } from "@/lib/api";

type Props = {
  item: Note;
};

const NoteItem = ({ item }: Props) => {
  return (
    <li>
      <Link href={`/notes/${item.id}`}>{item.title}</Link>
    </li>
  );
};

export default NoteItem;

// ==========================================================
// 6.10. Початок роботи з API / Список нотатків
// ==========================================================
//
// components/NoteItem/NoteItem.tsx

// import { Note } from "@/lib/api";

// type Props = {
//   item: Note;
// };

// const NoteItem = ({ item }: Props) => {
//   return (
//     <li>
//       <p>{item.title}</p>
//     </li>
//   );
// };

// export default NoteItem;

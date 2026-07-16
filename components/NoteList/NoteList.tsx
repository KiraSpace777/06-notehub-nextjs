// ==========================================================
// 6.10. Початок роботи з API / Список нотатків
// ==========================================================
// Далі додаємо NoteList у компонент сторінки /notes/page.tsx.
// ----------------------------------------------------------
// components/NoteList/NoteList.tsx

import { Note } from "@/lib/api";
import NoteItem from "../NoteItem/NoteItem";

type Props = {
  notes: Note[];
};

const NoteList = ({ notes }: Props) => {
  return (
    <ul>
      {notes.map((note) => (
        <NoteItem key={note.id} item={note} />
      ))}
    </ul>
  );
};

export default NoteList;

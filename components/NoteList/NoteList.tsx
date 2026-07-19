"use client";

import Link from "next/link";
import { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function NoteList({ notes, onDelete, isDeleting }: NoteListProps) {
  return (
    /* Головна сітка відображення карток нотаток за класом list */
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <div>
            {/* Текстові блоки заголовка та основного змісту нотатки */}
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.content}>{note.content}</p>
          </div>

          {/* Нижня панель картки "footer" для відображення категорії та кнопок дій */}
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <Link href={`/notes/${note.id}`} className={css.link}>
              View details
            </Link>

            <button
              type="button"
              onClick={() => onDelete(note.id)}
              className={css.button}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ==========================================================
// 6.8. Знайомство з навігацією
// ==========================================================
// components/Header/Header.tsx

import css from "./Header.module.css";
import Link from "next/link";

const Header = () => {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/notes">Notes</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

// ==========================================================
// 6.7. Створення компонента - components/Header/Header.tsx
// ==========================================================
//
// import css from "./Header.module.css";

// const Header = () => {
//   return (
//     <header className={css.header}>
//       <h2>NoteHub</h2>
//       <nav>
//         <ul className={css.navigation}>
//           <li>Home</li>
//           <li>Notes</li>
//           <li>Profile</li>
//           <li>About</li>
//         </ul>
//       </nav>
//     </header>
//   );
// };

// export default Header;

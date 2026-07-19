// ==========================================================
// Глобальна розмітка структури сторінок (повторювані елементи)
// ==========================================================
// Підключення провайдера React Query (для завантаження даних у
// клієнтському компоненті), робимо один раз на весь проєкт, тому
// робимо це в головному шаблоні "app/layout.tsx", імпорт із папки:
// ----------------------------------------------------------
// components/TanStackProvider/TanStackProvider.tsx
// ----------------------------------------------------------
//
// app/layout.tsx

import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
// ======================================================
// 6.7. Створення компонента - app/layout.tsx
// (Компонент RootLayout)
// ======================================================
//
// import type { Metadata } from "next";
//
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Header from "@/components/Header/Header";

// // Підключення шрифтів
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${geistSans.variable} ${geistMono.variable}`}>
//         <Header />
//         <main>{children}</main>
//         <footer>
//           <p>
//             Created <time dateTime="2025">2025</time>
//           </p>
//         </footer>
//       </body>
//     </html>
//   );
// }

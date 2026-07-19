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

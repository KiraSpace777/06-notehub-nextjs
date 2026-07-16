<!-- ========================================================= -->
<!-- Структура Next.js проєкту -->
<!-- ========================================================= -->

Після створення проєкту з використанням Next.js ви отримаєте типовий набір папок і файлів, які організовують ваш код.

<!-- 1. app – головна папка застосунку -->
<!-- ------------------------------------------------- -->

Це основна директорія, в якій ви працюватимете. Next.js автоматично формує маршрути на основі структури цієї папки.
<!-- ------------------------------------------------- -->

page.tsx – головна сторінка застосунку (маршрут /).
layout.tsx – спільна оболонка для всіх сторінок (хедер, футер тощо).
globals.css – глобальні стилі, які застосовуються до всього застосунку.
page.module.css – локальні стилі тільки для головної сторінки.

У майбутньому ви додаватимете сюди окремі підпапки для інших сторінок (наприклад, about/page.tsx, notes/page.tsx тощо).

<!-- 2. public – статичні ресурси -->
<!-- ------------------------------------------------- -->

Ця папка призначена для файлів, які мають бути напряму доступними з браузера:

зображення (/logo.png, /banner.jpg);
службові файли (/robots.txt, /manifest.json).

Усе, що знаходиться в public, доступне за шляхом /назва_файлу.

<!-- 3. next.config.ts – конфігурація Next.js -->
<!-- ------------------------------------------------- -->

Цей файл дозволяє змінювати стандартну поведінку Next.js:

налаштовувати домени для зображень;
додавати змінні середовища;
вмикати/вимикати експериментальні можливості тощо.

На старті курсів залишайте цей файл без змін – до нього ми повернемося пізніше.

<!-- 4. tsconfig.json – конфігурація TypeScript -->
<!-- ------------------------------------------------- -->

Файл автоматично створюється, якщо ви обрали TypeScript під час ініціалізації. Він визначає правила перевірки типів та автодоповнення в редакторі.

<!-- 5. package.json – залежності та команди -->

Цей файл містить перелік всіх встановлених бібліотек, а також корисні скрипти для запуску та збірки проєкту:
<!-- ------------------------------------------------- -->

npm run dev – запуск локального сервера розробки;
npm run build – створення продакшн-версії;
npm run start – запуск зібраного застосунку.

<!-- Висновок -->
<!-- Структура Next.js-проєкту інтуїтивна: -->

Код інтерфейсу – у папці app/;
Статичні файли – у public/;
Налаштування – у next.config.ts та tsconfig.json;
Інформація про залежності – у package.json.

Розуміння цієї структури допоможе вам швидко орієнтуватися в проєкті, підтримувати порядок і розширювати застосунок у правильному напрямку.

<!-- ========================================================= -->

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

// ==========================================================
// 6.14 Завантаження даних у клієнтському компоненті / Prefetch і кешування
// ==========================================================
// Далі, до серверного компонента app/notes/[id]/page.tsx повертаємо логіку читання ідентифікатора із параметрів. Також додамо код, щоб компонент завантажував дані заздалегідь (prefetch): app/notes/[id]/page.tsx
// *** prefetchQuery – функція, яка завчасно завантажить нам ці нотатки та збереже їх у кеш на сервері. Завдяки цьому при виклику useQuery у клієнтському компоненті, дані вже будуть доступні – без повторного запиту.
// *** queryKey – ключ, за яким дані будуть збережені у кеш
// *** queryFn – функція HTTP-запиту

// // Для того, щоб використати ці дані в клієнтському компоненті, необхідно використати HydrationBoundary із React Query:
// *** HydrationBoundary – компонент, передає кеш клієнту
// *** dehydrate(queryClient) – перетворює кеш у серіалізований обʼєкт
// ----------------------------------------------------------
// app/notes/[id]/page.tsx
//
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getSingleNote } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

type Props = {
  params: Promise<{ id: string }>;
};

const NoteDetails = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getSingleNote(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteDetails;
// ==========================================================
// 6.14 Завантаження даних у клієнтському компоненті
// ==========================================================
// Проблема: обробка подій у серверному компоненті
// Сторінка деталей – це серверний компонент, який виконується на сервері. Користувач отримує вже згенерований HTML без клієнтських обробників подій.
// -------------------------
// const handleClick = () => {
//   console.log("CLICK");
// };
// <button onClick={handleClick}>Edit</button> // ❌ не працює
// -------------------------
// Next.js попередить, що обробку подій можна зробити лише у клієнтських компонентах, для яких потрібно явно додати директиву "use client". Але в такому випадку одразу отримаємо попередження від лінтера про те, що клієнтський компонент не може бути async
// Якщо зробити сторінку повністю клієнтською – доведеться переписати все, зокрема й асинхронну логіку. Це незручно. Замість того щоб робити всю сторінку клієнтською (що спричинило б інші проблеми), ми залишаємо page.tsx серверним, а вміст переносимо у клієнтський компонент.
// -------------------------
// Структура:
// -------------------------
// app/notes/[id]/page.tsx – залишаємо page.tsx серверним
// app/notes/[id]/NoteDetails.client.tsx – створюємо окремий клієнтський компонент для інтерактивного вмісту
// -----------------------
// 3) Prefetch і кешування
// Далі, до серверного компонента app/notes/[id]/page.tsx повертаємо логіку читання ідентифікатора із параметрів. Також додамо код, щоб компонент завантажував дані заздалегідь (prefetch): app/notes/[id]/page.tsx
// -----------------------
// ----------------------------------------------------------
// app/notes/[id]/page.tsx

// import { getSingleNote } from "@/lib/api";

// type Props = {
//   params: Promise<{ id: string }>;
// };

// const NoteDetails = async ({ params }: Props) => {
//   const { id } = await params;
//   const note = await getSingleNote(id);

//   const formattedDate = note.updatedAt
//     ? `Updated at: ${note.updatedAt}`
//     : `Created at: ${note.createdAt}`;

//   return (
//     <div>
//       <h2>{note.title}</h2>
//       <p>{note.content}</p>
//       <button>Edit</button>
//       <p>{formattedDate}</p>
//     </div>
//   );
// };

// export default NoteDetails;

// ==========================================================
// 6.13 Динамічні маршрути / Підсумок
// ==========================================================
// [id] – синтаксис динамічних маршрутів у Next.js
// Дані параметри автоматично потрапляють у params як сторінок так і хендлерів
// Обробка помилок і завантаження – через спеціальні файли error.tsx і loading.tsx
// ----------------------------------------------------------
//
// app/notes/[id]/page.tsx

// import { getSingleNote } from "@/lib/api";

// type Props = {
//   params: Promise<{ id: string }>;
// };

// const NoteDetails = async ({ params }: Props) => {
//   const { id } = await params;
//   const note = await getSingleNote(id);

//   const formattedDate = note.updatedAt
//     ? `Updated at: ${note.updatedAt}`
//     : `Created at: ${note.createdAt}`;

//   return (
//     <div>
//       <h2>{note.title}</h2>
//       <p>{note.content}</p>
//       <button>Edit</button>
//       <p>{formattedDate}</p>
//     </div>
//   );
// };

// export default NoteDetails;

// ==========================================================
// 6.13 Динамічні маршрути / Отримання id з URL
// ==========================================================
// 1) Next.js автоматично передає параметри маршруту у пропс params. В серверному компоненті params це проміс, тому перед ним потрібно додати await, щоб почекати поки він виконається зі значенням. Додамо функцію getSingleNote до API: // lib/api.ts (2)
// 3) використаємо функцію getSingleNote до API
// Якщо запит поверне помилку (наприклад, нотатки не існує) – спрацює компонент error.tsx. Якщо в поточній папці його немає, Next.js підніметься вище у структурі, поки не знайде глобальний error.tsx
// ----------------------------------------------------------

// // app/notes/[id]/page.tsx

// import { getSingleNote } from "@/lib/api";
// // 6.13.3 - використаємо функцію lib/api.ts з динамічного маршруту

// type Props = {
//   params: Promise<{ id: string }>;
// };

// const NoteDetails = async ({ params }: Props) => {
//   const { id } = await params;
//   const note = await getSingleNote(id);
//   console.log(note);

//   return <div>NoteDetails</div>;
// };

// export default NoteDetails;

// ==========================================================
// 6.13.1 Динамічні маршрути
// ==========================================================
// У Next.js структура маршруту базується на папках. Для динамічного маршруту використовується формат у квадратних дужках:
// ----------------------------------------------------------

// app/notes/[id]/page.tsx

// const NoteDetails = () => {
//   return <div>Note Details</div>;
// };

// export default NoteDetails;

"use client";

import usePushNotifications from "@/hooks/usePushNotifications";
import { useEffect, useState } from "react";

export default function Home() {
  const { setupPush, fcmToken, errors } = usePushNotifications();
  

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const body = e.target.body.value;

    const res = await fetch("/api/send-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });

    const data = await res.json();
    console.log("Push sent:", data);
    alert("Notification sent!");
  };

  return (
    <div className="min-h-screen p-6 sm:p-12 bg-gradient-to-br from-gray-900 via-[#1e1e2f] to-black text-white font-mono flex flex-col gap-16 items-center justify-center">
      <main className="flex flex-col gap-6 items-center text-center w-full max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight">🔔 Push Notification POC</h1>

        <button
          onClick={() => setupPush()}
          className="bg-pink-600 hover:bg-pink-700 transition text-white px-6 py-3 rounded-full shadow-md"
        >
          🚀 Setup Push
        </button>

        <div className="w-full bg-[#121212] border border-gray-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">📲 Dummy FCM Token</h2>
          <code className="break-words text-sm text-green-400">{fcmToken}</code>
          <code className="break-words text-sm text-red-400">{errors.join(", ")}</code>
        </div>

        <div className="w-full bg-[#1c1c1c] border border-gray-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">🧪 Preview Notification</h2>
          <div className="bg-black text-left p-3 rounded-md shadow-inner border border-pink-500">
            <p className="text-pink-400 font-bold">Hello!</p>
            <p className="text-gray-300">This is your push test 🎯</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 bg-[#1c1c1c] p-4 rounded-md border border-gray-700 w-full"
        >
          <h2 className="text-lg font-semibold mb-2">📤 Send Push Notification</h2>
          <input
            type="text"
            name="title"
            placeholder="Notification Title"
            required
            className="p-2 rounded bg-black text-white border border-gray-600"
          />
          <input
            type="text"
            name="body"
            placeholder="Notification Body"
            required
            className="p-2 rounded bg-black text-white border border-gray-600"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-full shadow"
          >
            🎯 Send Push
          </button>
        </form>
      </main>
    </div>
  );
}


// "use client";

// import usePushNotifications from "@/hooks/usePushNotifications";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// export default function Home() {
//   const { setupPush } = usePushNotifications();
//   const [fcmToken, setFcmToken] = useState("fcm_dummy_token_1234567890");

//   useEffect(() => {
//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker
//         .register("/firebase-messaging-sw.js")
//         .then((registration) => {
//           console.log("✅ Service Worker registered:", registration);
//         })
//         .catch((error) => {
//           console.error("❌ Service Worker registration failed:", error);
//         });
//     }
//   }, []);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     const title = e.target.title.value;
//     const body = e.target.body.value;

//     const res = await fetch("/api/send-push", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title, body }),
//     });

//     const data = await res.json();
//     console.log("Push sent:", data);
//     alert("Notification sent!");
//   };

//   return (
//     <div className="min-h-screen p-6 sm:p-12 bg-gradient-to-br from-gray-900 via-[#1e1e2f] to-black text-white font-mono flex flex-col gap-16 items-center justify-center">
//       <main className="flex flex-col gap-6 items-center text-center w-full max-w-xl">
//         <h1 className="text-3xl font-bold tracking-tight">🔔 Push Notification POC</h1>

//         <button
//           onClick={() => setupPush()}
//           className="bg-pink-600 hover:bg-pink-700 transition text-white px-6 py-3 rounded-full shadow-md"
//         >
//           🚀 Setup Push
//         </button>

//         <div className="w-full bg-[#121212] border border-gray-700 p-4 rounded-md">
//           <h2 className="text-lg font-semibold mb-2">📲 Dummy FCM Token</h2>
//           <code className="break-words text-sm text-green-400">{fcmToken}</code>
//         </div>

//         <div className="w-full bg-[#1c1c1c] border border-gray-700 p-4 rounded-md">
//           <h2 className="text-lg font-semibold mb-2">🧪 Preview Notification</h2>
//           <div className="bg-black text-left p-3 rounded-md shadow-inner border border-pink-500">
//             <p className="text-pink-400 font-bold">Hello!</p>
//             <p className="text-gray-300">This is your push test 🎯</p>
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col gap-3 bg-[#1c1c1c] p-4 rounded-md border border-gray-700 w-full"
//         >
//           <h2 className="text-lg font-semibold mb-2">📤 Send Push Notification</h2>
//           <input
//             type="text"
//             name="title"
//             placeholder="Notification Title"
//             required
//             className="p-2 rounded bg-black text-white border border-gray-600"
//           />
//           <input
//             type="text"
//             name="body"
//             placeholder="Notification Body"
//             required
//             className="p-2 rounded bg-black text-white border border-gray-600"
//           />
//           <button
//             type="submit"
//             className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-full shadow"
//           >
//             🎯 Send Push
//           </button>
//         </form>
//       </main>
//     </div>
//   );
// }


// // "use client";
// // import usePushNotifications from "@/hooks/usePushNotifications";
// // import Image from "next/image";
// // import { useEffect } from "react";

// // export default function Home() {
// //   const  { setupPush } = usePushNotifications();

// //   useEffect(() => {
// //     if ('serviceWorker' in navigator) {
// //       navigator.serviceWorker
// //         .register('/firebase-messaging-sw.js')
// //         .then((registration) => {
// //           console.log('✅ Service Worker registered:', registration);
// //         })
// //         .catch((error) => {
// //           console.error('❌ Service Worker registration failed:', error);
// //         });
// //     }
// //   }, []);
  

  
// //   return (
// //     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
// //       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
// //         <button onClick={()=>{ setupPush() }}>setupPush</button>
// //         <Image
// //           className="dark:invert"
// //           src="/next.svg"
// //           alt="Next.js logo"
// //           width={180}
// //           height={38}
// //           priority
// //         />
// //         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
// //           <li className="mb-2 tracking-[-.01em]">
// //             Get started by editing{" "}
// //             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
// //               app/page.js
// //             </code>
// //             .
// //           </li>
// //           <li className="tracking-[-.01em]">
// //             Save and see your changes instantly.
// //           </li>
// //         </ol>

// //         <div className="flex gap-4 items-center flex-col sm:flex-row">
// //           <a
// //             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
// //             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             <Image
// //               className="dark:invert"
// //               src="/vercel.svg"
// //               alt="Vercel logomark"
// //               width={20}
// //               height={20}
// //             />
// //             Deploy now
// //           </a>
// //           <a
// //             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
// //             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             Read our docs
// //           </a>
// //         </div>
// //       </main>
// //       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
// //       <a
// //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// //           rel="noopener noreferrer"
// //           href="#"
// //           onClick={()=>{ setupPush() }}
// //         >
// //           <Image
// //             aria-hidden
// //             src="/file.svg"
// //             alt="File icon"
// //             width={16}
// //             height={16}
// //           />
// //           Learn
// //         </a>
// //         <a
// //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// //           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           <Image
// //             aria-hidden
// //             src="/file.svg"
// //             alt="File icon"
// //             width={16}
// //             height={16}
// //           />
// //           Learn
// //         </a>
// //         <a
// //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// //           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           <Image
// //             aria-hidden
// //             src="/window.svg"
// //             alt="Window icon"
// //             width={16}
// //             height={16}
// //           />
// //           Examples
// //         </a>
// //         <a
// //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// //           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           <Image
// //             aria-hidden
// //             src="/globe.svg"
// //             alt="Globe icon"
// //             width={16}
// //             height={16}
// //           />
// //           Go to nextjs.org →
// //         </a>
// //       </footer>
// //     </div>
// //   );
// // }

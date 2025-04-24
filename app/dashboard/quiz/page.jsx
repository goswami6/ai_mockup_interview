"use client";
import Link from "next/link";

const languages = [
  { name: "HTML", imgSrc: "/icons/html.svg" },
  { name: "CSS", imgSrc: "/icons/css.svg" },
  { name: "JavaScript", imgSrc: "/icons/js.svg" },
  { name: "React", imgSrc: "/icons/react.svg" },
  { name: "Node.js", imgSrc: "/icons/node.svg" },
  { name: "Python", imgSrc: "/icons/python.svg" },
  { name: "Java", imgSrc: "/icons/java.svg" },
  { name: "SQL", imgSrc: "/icons/sql.svg" },
  { name: "Vue.js", imgSrc: "/icons/vue.svg" },
];

export default function Quiz() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 flex flex-col items-center justify-center p-8 mt-3">
      <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-12 text-center drop-shadow-md">
        Choose a Programming Language
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        {languages.map(({ name, imgSrc }) => (
          <Link
            key={name}
            href={`/dashboard/quiz/quizs/${name.toLowerCase()}`}
            className="bg-white text-indigo-700 font-semibold text-center py-6 rounded-xl text-lg sm:text-xl shadow-lg hover:scale-105 hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 ease-in-out border-2 border-indigo-300"
          >
            <img src={imgSrc} alt={name} className="w-16 h-16 mx-auto mb-4" />
            {name}
          </Link>
        ))}
      </div>
    </main>
  );
}

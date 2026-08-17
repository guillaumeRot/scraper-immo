"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Résultats",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/locations",
    label: "Locations",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    href: "/favoris",
    label: "Favoris",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    href: "/scanner",
    label: "Scanner",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
    ),
  },
  {
    href: "/dpe",
    label: "Données DPE",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside className="group/sidebar hidden md:flex flex-shrink-0 w-14 hover:w-52 transition-[width] duration-200 ease-in-out bg-white border-r border-gray-100 flex-col overflow-hidden z-10">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-100">
          <span className="text-xl leading-none flex-shrink-0">🏠</span>
          <span className="ml-3 text-indigo-600 font-semibold text-sm whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 delay-75">
            Immo App
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 ${
                  active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {item.icon}
                <span className="whitespace-nowrap text-sm font-medium opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 delay-75">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* En-tête mobile */}
      <header className="md:hidden fixed top-0 inset-x-0 z-20 h-14 flex items-center px-4 bg-white border-b border-gray-100">
        <span className="text-xl leading-none flex-shrink-0">🏠</span>
        <span className="ml-2 text-indigo-600 font-semibold text-sm">Immo App</span>
      </header>

      <main className="flex-1 p-4 pt-20 pb-24 sm:p-6 sm:pt-24 md:pt-6 md:pb-6 overflow-x-hidden min-w-0">
        {children}
      </main>

      {/* Barre de navigation mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 flex items-stretch justify-around bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-150 ${
                active ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              {item.icon}
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

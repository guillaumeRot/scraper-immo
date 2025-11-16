"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar - position absolue quand fermée */}
      <aside className={`${isSidebarOpen ? "w-64 relative" : "w-0 absolute"} bg-white shadow-md transition-all duration-300 ease-in-out overflow-hidden z-10`}>
        <div className="p-6 min-w-[16rem]">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block">
              <h1 className={`${isSidebarOpen ? "text-xl" : "text-lg"} font-bold text-indigo-600 hover:text-indigo-700 transition-colors`}>
                {isSidebarOpen ? "🏠 Immo App" : "🏠"}
              </h1>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-indigo-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                )}
              </svg>
            </button>
          </div>
        </div>
        <nav className="px-4 pb-6">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/" 
                className="flex items-center w-full text-left px-4 py-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
              >
                <span className="text-lg">📊</span>
                {isSidebarOpen && <span className="ml-3">Résultats</span>}
              </Link>
            </li>
            <li>
              <Link 
                href="/scanner" 
                className="flex items-center w-full text-left px-4 py-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
              >
                <span className="text-lg">🔍</span>
                {isSidebarOpen && <span className="ml-3">Scanner</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className={`flex-1 p-6 ${isSidebarOpen ? "max-w-5xl" : "max-w-7xl"} w-full transition-all duration-300 ease-in-out mx-auto`}>
        {!isSidebarOpen && (
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-600 hover:text-indigo-600 transition-colors p-2 rounded-md hover:bg-indigo-50 bg-white shadow-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                  Dernières annonces
                </h2>
                <p className="text-gray-600 mt-1">
                  Explorez les opportunités immobilières récentes.
                </p>
              </div>
            </div>
          </div>
        )}
        {isSidebarOpen && children}
        {!isSidebarOpen && children}
      </main>
    </div>
  );
}

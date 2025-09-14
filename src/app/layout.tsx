import "./globals.css";

export const metadata = {
  title: "Immo App",
  description: "Exploration d'annonces immobilières",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900">
        <header className="bg-white shadow p-4 sticky top-0 z-50">
          <h1 className="text-xl font-bold text-indigo-600">🏠 Immo App</h1>
        </header>
        <main className="p-6 max-w-6xl mx-auto">{children}</main>
      </body>
    </html>
  );
}

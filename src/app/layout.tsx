import Sidebar from "@/components/Sidebar";
import { SearchProvider } from "@/context/SearchContext";
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
        <SearchProvider>
          <Sidebar>{children}</Sidebar>
        </SearchProvider>
      </body>
    </html>
  );
}

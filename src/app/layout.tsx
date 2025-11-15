import Sidebar from "@/components/Sidebar";
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
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}

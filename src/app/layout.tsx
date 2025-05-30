import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Recipe App",
  description: "View and unlock delicious food recipes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <header className="bg-indigo-700 text-white p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Foodie Recipes
            </Link>
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="/"
                  className="hover:text-indigo-200 transition-colors"
                >
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="min-h-[calc(100vh-64px)] py-8">{children}</main>
      </body>
    </html>
  );
}

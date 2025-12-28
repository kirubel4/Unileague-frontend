import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UNILeague Hub",
  description: "Centralized platform for managing university leagues",
};

function Nav() {
  // This works in client components, so we use a workaround for SSR:
  let pathname = "";
  if (typeof window !== "undefined") {
    pathname = window.location.pathname;
  }
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tournaments", label: "Tournaments" },
    { href: "/teams", label: "Teams" },
    { href: "/matches", label: "Matches" },
    { href: "/news", label: "News" },
    { href: "/about", label: "About" },
  ];
  return (
    <nav className="w-full flex justify-center py-6 bg-white/90 border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <ul className="flex gap-2 md:gap-6">
        {navLinks.map((link) => {
          const isActive = typeof window !== "undefined" ? pathname === link.href : false;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${isActive ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}

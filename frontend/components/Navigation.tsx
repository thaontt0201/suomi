"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/speaking", label: "Speaking" },
  { href: "/writing", label: "Writing" },
  { href: "/vocabulary", label: "Vocabulary" },
  { href: "/progress", label: "Progress" },
  { href: "/history", label: "History" },
];

export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link href="/dashboard" className="text-xl font-bold text-blue-600">
        Suomi YKI
      </Link>
      <div className="flex gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
              pathname === link.href
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <a
        href="http://localhost:8000/auth/logout"
        className="text-sm text-gray-500 hover:text-red-500"
      >
        Sign out
      </a>
    </nav>
  );
}

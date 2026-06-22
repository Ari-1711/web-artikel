import type { ReactNode } from "react";

interface ProtectedRouteProps {
  role: "guest" | "user" | "admin";
  allowedRoles: ("guest" | "user" | "admin")[];
  children: ReactNode;
  fallbackView: string;
  setView: (v: string) => void;
}

export function ProtectedRoute({
  role,
  allowedRoles,
  children,
  fallbackView,
  setView,
}: ProtectedRouteProps) {
  // Jika peran user saat ini tidak ada di dalam daftar peran yang diizinkan
  const isAllowed = allowedRoles.includes(role);

  if (!isAllowed) {
    // Alihkan halaman ke view cadangan (misal: "login" atau "home")
    setView(fallbackView);
    return null; 
  }

  // Jika diizinkan, render komponen aslinya
  return <>{children}</>;
}
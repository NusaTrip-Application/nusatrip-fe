"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/services/auth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }
        
        const res = await getMyProfile();
        // Depending on how api is structured, the data might be res.data or just res.
        const user = res.data || res;
        
        if (user.role !== "ADMIN") {
          router.replace("/login");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      }
    };

    checkAdmin();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-main">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-text-muted">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

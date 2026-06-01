"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/redux/api/userApi";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authUser = useSelector((state: any) => state.auth.user);
  const [mounted, setMounted] = useState(false);
  
  const { data: userRes, isLoading, isFetching } = useGetMeQuery(undefined, {
    skip: !!authUser
  });

  const currentUser = authUser || userRes?.data || userRes;
  const isChecking = !mounted || (!authUser && (isLoading || isFetching));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isChecking && !currentUser) {
      router.replace("/login");
    }
  }, [currentUser, isChecking, router, mounted]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return null; // Let the useEffect redirect
  }

  return <>{children}</>;
}

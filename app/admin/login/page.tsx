"use client";

import { useEffect, useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, LogIn, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        router.push("/admin/dashboard");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-wedding-olive text-wedding-beige font-sans uppercase tracking-widest text-xl gap-3">
        <Loader2 className="animate-spin" /> Carregando...
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-wedding-beige p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-3xl p-10 text-center space-y-8 border-wedding-olive/10"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-wedding-olive/10">
          <Lock className="h-10 w-10 text-wedding-olive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-wedding-olive tracking-widest uppercase">Área Administrativa</h1>
          <p className="text-wedding-olive/60 font-sans">Efetue o login para gerir os seus convidados.</p>
        </div>

        <button
          onClick={handleLogin}
          className="btn-primary w-full py-5 text-lg font-bold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all"
        >
          <LogIn className="h-6 w-6" />
          ENTRAR COM GOOGLE
        </button>

        <p className="text-xs text-wedding-olive/30 font-sans tracking-widest uppercase">Victor & Lurdes © 2026</p>
      </motion.div>
    </div>
  );
}

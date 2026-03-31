"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getAllGuests, addGuest, deleteGuest, Guest } from "@/lib/db";
import { 
  Users, CheckCircle2, XCircle, Clock, LogOut, Plus,
  Trash2, Loader2, RefreshCw, Search, Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/admin/login");
      else { setUser(u); fetchGuests(); }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const data = await getAllGuests();
      setGuests(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    setIsAdding(true);
    try {
      await addGuest(newName, newPhone.trim());
      setNewName(""); setNewPhone("");
      fetchGuests();
    } catch (err) { console.error(err); }
    finally { setIsAdding(false); }
  };

  const handleRemoveGuest = async (id: string, name: string) => {
    if (!confirm(`Tens a certeza que desejas remover ${name}?`)) return;
    try { await deleteGuest(id); fetchGuests(); }
    catch (err) { console.error(err); }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.phone.includes(searchTerm)
  );

  const stats = {
    total: guests.length,
    attending: guests.filter(g => g.status === "attending").length,
    declined: guests.filter(g => g.status === "declined").length,
    pending: guests.filter(g => g.status === "pending").length,
  };

  if (loading && !guests.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-wedding-beige font-sans uppercase tracking-[0.2em] text-sm gap-4">
        <Loader2 className="animate-spin text-wedding-gold h-8 w-8" />
        <span>Carregando Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-beige p-4 md:p-8 selection:bg-wedding-gold/20">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-10">

        {/* ── HEADER ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl border-white/40 shadow-xl overflow-hidden"
        >
          {/* Main bar */}
          <div className="flex items-center justify-between gap-4 p-5 md:p-8">
            {/* Left: Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -inset-1 bg-wedding-gold/20 blur-md rounded-full" />
                {user?.photoURL
                  ? <img src={user.photoURL} alt="Admin" className="relative h-12 w-12 md:h-14 md:w-14 rounded-full border-2 border-wedding-gold object-cover shadow-md" />
                  : <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-full bg-wedding-olive flex items-center justify-center text-white shadow-md"><Users className="h-6 w-6" /></div>
                }
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-serif text-wedding-olive truncate">
                  {user?.displayName || "Administrador"}
                </h1>
                <p className="text-[10px] text-wedding-olive/40 tracking-[0.3em] uppercase font-bold hidden sm:block">
                  Painel de Gestão • Victor & Lurdes
                </p>
              </div>
            </div>

            {/* Right: Desktop actions */}
            <div className="hidden md:flex gap-3">
              <button onClick={fetchGuests} className="bg-white/40 hover:bg-white/60 text-wedding-olive px-5 py-2.5 rounded-2xl border border-white/20 transition-all font-bold flex items-center gap-2 group text-sm">
                <RefreshCw className="h-4 w-4 group-active:rotate-180 transition-transform duration-500" />
                Atualizar
              </button>
              <button onClick={handleLogout} className="btn-secondary px-5 py-2.5 flex items-center gap-2 text-sm">
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-3 rounded-2xl bg-white/30 hover:bg-white/50 text-wedding-olive transition-all"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile dropdown menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-white/20"
              >
                <div className="p-4 space-y-3">
                  <button
                    onClick={() => { fetchGuests(); setMenuOpen(false); }}
                    className="w-full bg-white/40 hover:bg-white/60 text-wedding-olive px-5 py-3 rounded-2xl border border-white/20 transition-all font-bold flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" /> Atualizar Lista
                  </button>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="w-full btn-secondary px-5 py-3 flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Terminar Sessão
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* ── STATS ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[
            { icon: <Users className="text-wedding-olive" />, label: "Total", value: stats.total, delay: 0.1 },
            { icon: <CheckCircle2 className="text-green-600" />, label: "Confirmados", value: stats.attending, delay: 0.2 },
            { icon: <XCircle className="text-red-500" />, label: "Recusados", value: stats.declined, delay: 0.3 },
            { icon: <Clock className="text-amber-500" />, label: "Pendente", value: stats.pending, delay: 0.4 },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: s.delay }}
              whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.08)" }}
              className="glass-dark p-5 md:p-8 rounded-3xl border-white/20 flex flex-col items-center justify-center gap-3 shadow-lg group hover:bg-white/40 transition-all cursor-default"
            >
              <div className="p-2.5 bg-white/60 rounded-2xl group-hover:bg-wedding-gold/10 transition-colors">
                {s.icon}
              </div>
              <div className="text-center">
                <p className="text-[9px] uppercase font-bold text-wedding-olive/40 tracking-[0.3em] mb-1">{s.label}</p>
                <p className="text-3xl md:text-4xl font-serif text-wedding-olive">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* ── MAIN CONTENT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 text-wedding-olive">

          {/* Add Guest Form */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-4 border border-white/40 p-6 md:p-10 rounded-3xl bg-white/20 backdrop-blur-xl space-y-8 lg:h-fit lg:sticky lg:top-6 shadow-inner"
          >
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-serif tracking-tight">Novo Convidado</h2>
              <div className="h-px w-12 bg-wedding-gold/40" />
            </div>

            <form onSubmit={handleAddGuest} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-wedding-olive/40 ml-1 tracking-[0.2em]">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white/40 border-2 border-wedding-gold/5 rounded-2xl p-4 outline-none focus:border-wedding-gold/40 transition-all focus:bg-white/60"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-wedding-olive/40 ml-1 tracking-[0.2em]">Telefone</label>
                <input
                  type="text"
                  placeholder="Ex: 923000000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-white/40 border-2 border-wedding-gold/5 rounded-2xl p-4 outline-none focus:border-wedding-gold/40 transition-all focus:bg-white/60"
                  required
                />
              </div>
              <button disabled={isAdding} className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3">
                {isAdding ? <Loader2 className="animate-spin" /> : <><Plus className="h-5 w-5" /> ADICIONAR À LISTA</>}
              </button>
            </form>
          </motion.section>

          {/* Guest List */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-8 flex flex-col gap-4"
          >
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-wedding-olive/30 group-focus-within:text-wedding-gold transition-colors h-5 w-5" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl py-4 pl-14 pr-6 outline-none focus:bg-white/60 transition-all shadow-sm"
              />
            </div>

            {/* Table */}
            <div className="glass rounded-3xl overflow-hidden shadow-xl border-white/40">
              <div className="px-6 md:px-10 py-5 bg-white/30 border-b border-white/20 flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-serif">Lista Completa</h2>
                <span className="bg-wedding-olive/10 text-wedding-olive text-[10px] px-4 py-1 rounded-full font-bold uppercase tracking-widest">
                  {filteredGuests.length} {filteredGuests.length === 1 ? "Pessoa" : "Pessoas"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="bg-wedding-olive/5 text-left text-[9px] text-wedding-olive/60 uppercase tracking-[0.3em] font-bold">
                      <th className="p-4 pl-6 md:pl-10">Convidado</th>
                      <th className="p-4">Contacto</th>
                      <th className="p-4">Situação</th>
                      <th className="p-4 pr-6 md:pr-10 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="font-sans text-sm">
                    <AnimatePresence>
                      {filteredGuests.map((g, idx) => (
                        <motion.tr
                          key={g.id}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: idx * 0.04 }}
                          className="border-b border-wedding-gold/5 hover:bg-white/30 transition-all group"
                        >
                          <td className="p-4 pl-6 md:pl-10 font-bold text-wedding-olive">{g.name}</td>
                          <td className="p-4 text-wedding-olive/60">{g.phone}</td>
                          <td className="p-4"><StatusBadge status={g.status} /></td>
                          <td className="p-4 pr-6 md:pr-10 text-right">
                            <button
                              onClick={() => handleRemoveGuest(g.id, g.name)}
                              className="text-red-300 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-2xl transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filteredGuests.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-20 text-center text-wedding-olive/20 tracking-[0.4em] uppercase text-xs font-serif">
                          Nenhum registo encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; border: string; pulse: string; label: string }> = {
    attending: { bg: "bg-green-50", text: "text-green-700", border: "border-green-100", pulse: "bg-green-500 animate-pulse", label: "Confirmado" },
    declined:  { bg: "bg-red-50",   text: "text-red-700",   border: "border-red-100",   pulse: "bg-red-400",             label: "Recusado"  },
    pending:   { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", pulse: "bg-amber-400",           label: "Pendente"  },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider border ${s.bg} ${s.text} ${s.border}`}>
      <div className={`h-1.5 w-1.5 rounded-full ${s.pulse}`} />
      {s.label}
    </span>
  );
}

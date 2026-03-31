"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getAllGuests, addGuest, deleteGuest, Guest } from "@/lib/db";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  LogOut, 
  Plus, 
  Trash2, 
  Loader2,
  RefreshCw,
  Search
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
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        setUser(user);
        fetchGuests();
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const data = await getAllGuests();
      setGuests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    setIsAdding(true);
    try {
      await addGuest(newName, newPhone.trim());
      setNewName("");
      setNewPhone("");
      fetchGuests();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveGuest = async (id: string, name: string) => {
    if (!confirm(`Tens a certeza que desejas remover ${name}?`)) return;
    try {
      await deleteGuest(id);
      fetchGuests();
    } catch (err) {
      console.error(err);
    }
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
    attending: guests.filter(g => g.status === 'attending').length,
    declined: guests.filter(g => g.status === 'declined').length,
    pending: guests.filter(g => g.status === 'pending').length,
  };

  if (loading && !guests.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-wedding-beige bg-grain font-sans uppercase tracking-[0.2em] text-sm gap-4">
        <Loader2 className="animate-spin text-wedding-gold h-8 w-8" />
        <span>Carregando Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-beige bg-grain p-4 md:p-12 selection:bg-wedding-gold/20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center glass p-8 rounded-[2.5rem] border-white/40 gap-8 shadow-xl"
        >
          <div className="flex items-center gap-6">
             <div className="relative">
               <motion.div 
                 animate={{ scale: [1, 1.1, 1] }} 
                 transition={{ repeat: Infinity, duration: 4 }}
                 className="absolute -inset-2 bg-wedding-gold/10 blur-lg rounded-full"
               />
               {user?.photoURL ? (
                  <img src={user.photoURL} alt="Admin" className="relative h-16 w-16 rounded-full border-2 border-wedding-gold object-cover shadow-md" />
               ) : (
                  <div className="relative h-16 w-16 rounded-full bg-wedding-olive flex items-center justify-center text-white shadow-md">
                    <Users className="h-8 w-8" />
                  </div>
               )}
             </div>
             <div className="space-y-1 text-center md:text-left">
                <h1 className="text-3xl font-serif text-wedding-olive tracking-tight">Olá, {user?.displayName || 'Administrador'}</h1>
                <p className="text-[10px] text-wedding-olive/40 tracking-[0.4em] uppercase font-bold">Painel de Gestão • Victor & Lurdes</p>
             </div>
          </div>
          <div className="flex gap-4">
              <button 
                onClick={fetchGuests}
                className="bg-white/40 hover:bg-white/60 text-wedding-olive px-6 py-3 rounded-2xl border border-white/20 transition-all font-bold flex items-center gap-2 group"
              >
                <RefreshCw className="h-4 w-4 group-active:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline uppercase text-xs tracking-wider">Atualizar</span>
              </button>
              <button 
                onClick={handleLogout}
                className="btn-secondary px-6 py-3 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="uppercase text-xs tracking-wider">Sair</span>
              </button>
          </div>
        </motion.header>

        {/* Dynamic Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard icon={<Users className="text-wedding-olive" />} label="Total" value={stats.total} delay={0.1} />
          <StatCard icon={<CheckCircle2 className="text-green-600" />} label="Confirmados" value={stats.attending} delay={0.2} />
          <StatCard icon={<XCircle className="text-red-500" />} label="Recusados" value={stats.declined} delay={0.3} />
          <StatCard icon={<Clock className="text-amber-500" />} label="Pendente" value={stats.pending} delay={0.4} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-wedding-olive">
            
            {/* Left: Registration Form */}
            <motion.section 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-4 border border-white/40 p-10 rounded-[2.5rem] bg-white/20 backdrop-blur-xl space-y-10 h-fit sticky top-12 shadow-inner"
            >
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif tracking-tight">Novo Convidado</h2>
                  <div className="h-px w-12 bg-wedding-gold/40" />
                </div>

                <form onSubmit={handleAddGuest} className="space-y-8">
                    <div className="space-y-3 group">
                        <label className="text-[10px] uppercase font-bold text-wedding-olive/40 ml-1 tracking-[0.2em]">Nome Completo</label>
                        <input 
                            type="text" 
                            placeholder="Ex: João Silva"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-white/40 border-2 border-wedding-gold/5 rounded-2xl p-5 outline-none focus:border-wedding-gold/40 transition-all focus:bg-white/60"
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-bold text-wedding-olive/40 ml-1 tracking-[0.2em]">Telefone Directo</label>
                        <input 
                            type="text" 
                            placeholder="Ex: 923000000"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            className="w-full bg-white/40 border-2 border-wedding-gold/5 rounded-2xl p-5 outline-none focus:border-wedding-gold/40 transition-all focus:bg-white/60"
                            required
                        />
                    </div>
                    <button 
                        disabled={isAdding}
                        className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3"
                    >
                        {isAdding ? <Loader2 className="animate-spin" /> : (
                          <>
                            <Plus className="h-5 w-5" />
                            ADICIONAR À LISTA
                          </>
                        )}
                    </button>
                </form>
            </motion.section>

            {/* Right: Search & Guest List */}
            <motion.section 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-8 flex flex-col gap-6"
            >
                {/* Search Bar */}
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-wedding-olive/30 group-focus-within:text-wedding-gold transition-colors" />
                  <input 
                    type="text"
                    placeholder="Pesquisar por nome ou número..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl py-6 pl-16 pr-6 outline-none focus:bg-white/60 transition-all shadow-sm"
                  />
                </div>

                {/* List Container */}
                <div className="glass rounded-[2.5rem] overflow-hidden shadow-xl border-white/40 flex-1">
                  <div className="px-10 py-6 bg-white/30 border-b border-white/20 flex justify-between items-center">
                      <h2 className="text-xl font-serif">Lista Completa</h2>
                      <span className="bg-wedding-olive/10 text-wedding-olive text-[10px] px-4 py-1 rounded-full font-bold uppercase tracking-widest">{filteredGuests.length} Pessoas</span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-wedding-olive/5 text-left text-[9px] text-wedding-olive/60 uppercase tracking-[0.3em] font-bold">
                                <th className="p-6 pl-10">Convidado</th>
                                <th className="p-6">Contacto</th>
                                <th className="p-6">Situação</th>
                                <th className="p-6 pr-10 text-right">Ações</th>
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
                                    transition={{ delay: idx * 0.05 }}
                                    className="border-b border-wedding-gold/5 hover:bg-white/30 transition-all group"
                                >
                                    <td className="p-6 pl-10 font-bold text-wedding-olive">{g.name}</td>
                                    <td className="p-6 text-wedding-olive/60">{g.phone}</td>
                                    <td className="p-6">
                                        <StatusBadge status={g.status} />
                                    </td>
                                    <td className="p-6 pr-10 text-right">
                                        <button 
                                            onClick={() => handleRemoveGuest(g.id, g.name)}
                                            className="text-red-300 hover:text-red-500 hover:bg-red-50 p-3 rounded-2xl transition-all"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                          </AnimatePresence>
                          {filteredGuests.length === 0 && (
                              <tr>
                                  <td colSpan={4} className="p-32 text-center text-wedding-olive/20 tracking-[0.4em] uppercase text-xs font-serif">
                                      Nenhum registro encontrado
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

function StatCard({ icon, label, value, delay }: { icon: React.ReactNode, label: string, value: number, delay: number }) {
  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
        className="glass-dark p-8 rounded-4xl border-white/20 space-y-4 flex flex-col items-center justify-center shadow-lg group hover:bg-white/40 transition-all"
    >
        <div className="p-3 bg-white/60 rounded-2xl group-hover:bg-wedding-gold/10 transition-colors">
            {icon}
        </div>
        <div className="text-center">
            <p className="text-[9px] uppercase font-bold text-wedding-olive/40 tracking-[0.3em] mb-1">{label}</p>
            <p className="text-4xl font-serif text-wedding-olive">{value}</p>
        </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
    switch(status) {
        case 'attending': return (
          <span className="flex items-center gap-2 w-fit bg-green-50 text-green-700 font-bold px-3 py-1.5 rounded-xl text-[9px] uppercase tracking-wider shadow-sm border border-green-100">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Confirmado
          </span>
        );
        case 'declined': return (
          <span className="flex items-center gap-2 w-fit bg-red-50 text-red-700 font-bold px-3 py-1.5 rounded-xl text-[9px] uppercase tracking-wider shadow-sm border border-red-100">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Recusado
          </span>
        );
        default: return (
          <span className="flex items-center gap-2 w-fit bg-amber-50 text-amber-700 font-bold px-3 py-1.5 rounded-xl text-[9px] uppercase tracking-wider shadow-sm border border-amber-100">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pendente
          </span>
        );
    }
}

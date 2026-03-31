"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Loader2, Phone, PartyPopper, HeartCrack } from "lucide-react";
import { checkGuestByPhone, updateRSVP, Guest } from "@/lib/db";

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 } as any
  },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } as any }
};

type Step = "input" | "confirm" | "already-responded" | "success" | "error";

export default function RSVPModal({ isOpen, onClose }: RSVPModalProps) {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const resetModal = () => {
    setPhone(""); setStep("input"); setGuest(null); setErrorMsg("");
  };

  const handleClose = () => { resetModal(); onClose(); };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const foundGuest = await checkGuestByPhone(phone.trim());
      if (foundGuest) {
        setGuest(foundGuest);
        if (foundGuest.status === "attending" || foundGuest.status === "declined") {
          setStep("already-responded");
        } else {
          setStep("confirm");
        }
      } else {
        setStep("error");
        setErrorMsg("Desculpe, este número não consta na nossa lista de convidados.");
      }
    } catch {
      setStep("error");
      setErrorMsg("Ocorreu um erro ao verificar o convidado.");
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (status: "attending" | "declined") => {
    if (!guest) return;
    setLoading(true);
    try {
      await updateRSVP(guest.id, status);
      setStep("success");
    } catch {
      setErrorMsg("Erro ao salvar a sua resposta.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-wedding-olive/40 backdrop-blur-md"
        onClick={handleClose}
      />

      <motion.div
        variants={scaleUp} initial="hidden" animate="visible" exit="exit"
        className="glass relative w-full max-w-lg overflow-hidden rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border-white/40 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 text-wedding-olive/40 hover:text-wedding-olive hover:rotate-90 transition-all duration-300"
        >
          <X className="h-6 w-6" />
        </button>

        <AnimatePresence mode="wait">

          {/* ── INPUT ── */}
          {step === "input" && (
            <motion.div key="input" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-wedding-gold/10 text-wedding-gold mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-serif text-wedding-olive">Confirmar Presença</h2>
                <p className="text-wedding-olive/60 font-sans text-sm tracking-wide">Introduza o seu número de telefone para aceder ao convite</p>
              </div>
              <form onSubmit={handleCheck} className="space-y-6">
                <input
                  type="text"
                  placeholder="9XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border-2 border-wedding-gold/10 bg-white/40 px-6 py-5 text-center text-2xl font-medium text-wedding-olive outline-none focus:border-wedding-gold/50 focus:bg-white/80 transition-all placeholder:text-wedding-olive/20"
                  required
                />
                <button disabled={loading} className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3">
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      Verificar Convite
                      <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── JÁ RESPONDEU ── */}
          {step === "already-responded" && guest && (
            <motion.div key="already-responded" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center py-4">
              <div className="relative inline-block">
                <motion.div
                  className="absolute -inset-4 blur-xl rounded-full"
                  style={{ background: guest.status === "attending" ? "rgba(85,107,47,0.15)" : "rgba(239,68,68,0.1)" }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
                {guest.status === "attending"
                  ? <PartyPopper className="relative h-20 w-20 text-wedding-olive" />
                  : <HeartCrack className="relative h-20 w-20 text-red-400" />
                }
              </div>

              <div className="space-y-3">
                <p className="text-wedding-gold font-sans tracking-[0.3em] uppercase text-xs">{guest.name}</p>
                <h2 className="text-2xl sm:text-3xl font-serif text-wedding-olive">Já respondeste!</h2>
                <div className="h-px w-12 bg-wedding-gold/30 mx-auto" />
                <p className="text-wedding-olive/70 font-sans text-sm leading-relaxed px-2">
                  {guest.status === "attending"
                    ? "A tua presença já está confirmada. Estamos ansiosos por celebrar contigo! 🎉"
                    : "Já nos informaste que não poderás comparecer. Agradecemos o aviso!"}
                </p>
                <div className="flex justify-center pt-1">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border ${guest.status === "attending" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                    <div className={`h-2 w-2 rounded-full ${guest.status === "attending" ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
                    {guest.status === "attending" ? "Presença Confirmada" : "Não comparece"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-wedding-olive/40 text-xs font-sans">Deseja alterar a sua resposta?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleRSVP("attending")} disabled={loading || guest.status === "attending"} className="btn-primary py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                    SIM, VOU
                  </button>
                  <button onClick={() => handleRSVP("declined")} disabled={loading || guest.status === "declined"} className="btn-secondary py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                    NÃO VOU
                  </button>
                </div>
                <button onClick={handleClose} className="w-full text-wedding-olive/40 text-xs font-sans hover:text-wedding-olive transition-colors pt-2">
                  Fechar
                </button>
              </div>
            </motion.div>
          )}

          {/* ── CONFIRMAR ── */}
          {step === "confirm" && guest && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 text-center">
              <div className="space-y-4">
                <p className="text-wedding-gold font-sans tracking-[0.3em] uppercase text-xs">Seja bem-vindo</p>
                <h2 className="text-4xl sm:text-5xl font-wedding text-wedding-olive">Olá, {guest.name}!</h2>
                <div className="h-px w-12 bg-wedding-gold/30 mx-auto" />
                <p className="text-wedding-olive/70 font-sans leading-relaxed px-4">
                  É uma honra ter-te connosco. Pode confirmar a sua presença neste dia tão especial?
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button onClick={() => handleRSVP("attending")} disabled={loading} className="btn-primary py-5 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  SIM, COM CERTEZA
                </button>
                <button onClick={() => handleRSVP("declined")} disabled={loading} className="btn-secondary py-5 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  NÃO PODEREI IR
                </button>
              </div>
            </motion.div>
          )}

          {/* ── SUCESSO ── */}
          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center py-6">
              <div className="relative inline-block">
                <motion.div className="absolute -inset-4 bg-wedding-olive/10 blur-xl rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 3 }} />
                <CheckCircle className="relative h-24 w-24 text-wedding-olive" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-serif text-wedding-olive tracking-tight">Presença Confirmada!</h2>
                <p className="text-wedding-olive/60 font-sans max-w-xs mx-auto text-sm leading-relaxed">
                  Obrigado por fazer parte da nossa história. Estamos ansiosos por partilhar este dia contigo!
                </p>
              </div>
              <button onClick={handleClose} className="btn-primary w-full py-4 mt-4">CONCLUÍDO</button>
            </motion.div>
          )}

          {/* ── ERRO ── */}
          {step === "error" && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center py-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-400">
                <AlertCircle className="h-12 w-12" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-serif text-red-600">Não encontrado</h2>
                <p className="text-wedding-olive/70 font-sans text-sm leading-relaxed px-4">{errorMsg}</p>
              </div>
              <button onClick={() => { setStep("input"); setErrorMsg(""); }} className="btn-secondary w-full py-4 border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600">
                TENTAR NOVAMENTE
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}

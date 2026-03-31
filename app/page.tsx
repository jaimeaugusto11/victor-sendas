"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Calendar, MapPin, Search, Sparkles } from "lucide-react";
import Hero from "@/components/Hero";
import RSVPModal from "@/components/RSVPModal";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } as any
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.2
    }
  },
  viewport: { once: true }
};

export default function Home() {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);

  return (
    <main className="min-h-screen bg-wedding-beige bg-grain overflow-hidden selection:bg-wedding-gold/30">
      <Hero />

      {/* Main Invitation Section */}
      <section className="relative py-24 md:py-40 px-6 max-w-7xl mx-auto">
        {/* Decorative background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-wedding-gold to-transparent" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Quote & Hearts */}
          <motion.div 
            className="lg:col-span-5 space-y-12"
            {...fadeIn}
          >
            <div className="flex items-center gap-4 text-wedding-gold/60">
              <div className="h-px w-12 bg-wedding-gold/40" />
              <div className="flex gap-2">
                <Heart className="h-3 w-3 fill-wedding-gold" />
                <Heart className="h-5 w-5 fill-wedding-gold -mt-1" />
                <Heart className="h-3 w-3 fill-wedding-gold" />
              </div>
              <div className="h-px w-12 bg-wedding-gold/40" />
            </div>

            <h2 className="text-wedding-olive/90 font-serif italic text-3xl md:text-5xl leading-tight">
              "A vida é feita de momentos, e os melhores são aqueles que partilhamos com quem amamos."
            </h2>
            
            <div className="flex items-center gap-4 text-wedding-olive/40 font-sans tracking-widest text-xs uppercase">
              <Sparkles className="h-4 w-4" />
              <span>Uma nova etapa começa</span>
            </div>
          </motion.div>

          {/* Right Column: Info Cards */}
          <div className="lg:col-span-7">
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <motion.div 
                variants={fadeIn}
                className="glass-dark p-10 rounded-[2rem] space-y-6 hover:shadow-2xl transition-shadow group"
              >
                <div className="h-14 w-14 bg-wedding-gold/10 rounded-2xl flex items-center justify-center text-wedding-gold group-hover:scale-110 transition-transform">
                  <Calendar className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-wedding-olive text-2xl font-bold uppercase tracking-tighter">A Data</h3>
                  <div className="h-px w-12 bg-wedding-gold/30" />
                  <p className="text-wedding-olive/60 font-sans text-sm tracking-[0.2em] uppercase pt-2">A Confirmar Brevemente</p>
                </div>
              </motion.div>

              <motion.div 
                variants={fadeIn}
                className="glass-dark p-10 rounded-[2rem] space-y-6 translate-y-0 md:translate-y-12 hover:shadow-2xl transition-shadow group"
              >
                <div className="h-14 w-14 bg-wedding-gold/10 rounded-2xl flex items-center justify-center text-wedding-gold group-hover:scale-110 transition-transform">
                  <MapPin className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-wedding-olive text-2xl font-bold uppercase tracking-tighter">O Local</h3>
                  <div className="h-px w-12 bg-wedding-gold/30" />
                  <p className="text-wedding-olive/60 font-sans text-sm tracking-[0.2em] uppercase pt-2">Luanda, Angola</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Call to Action Section */}
        <motion.div 
          className="mt-40 text-center space-y-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          <div className="space-y-4">
            <h2 className="text-5xl md:text-8xl font-wedding text-gold-gradient">Save the Date</h2>
            <p className="text-wedding-olive/50 font-sans tracking-[0.5em] text-sm md:text-base uppercase">Prepare o seu coração</p>
          </div>

          <div className="relative inline-block">
            <motion.div 
              className="absolute -inset-4 bg-wedding-gold/10 blur-2xl rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
            <button
              onClick={() => setIsRSVPOpen(true)}
              className="btn-primary relative z-10 flex items-center justify-center gap-4 py-8 px-16 text-xl group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Search className="h-6 w-6 group-hover:rotate-12 transition-transform" />
              CONFIRMAR PRESENÇA
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative mt-20 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-wedding-olive" />
        <div className="absolute inset-0 bg-grain opacity-10" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8 px-6">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-wedding-beige font-wedding text-5xl md:text-7xl"
          >
            Victor & Lurdes
          </motion.p>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-wedding-gold/40 to-transparent mx-auto" />
          <p className="font-sans text-xs md:text-sm tracking-[0.4em] text-white/40 uppercase">#VictorELurdes2026</p>
          <p className="text-white/20 text-[10px] uppercase tracking-widest pt-8">Feito com amor • Angola</p>
        </div>
      </footer>

      <RSVPModal isOpen={isRSVPOpen} onClose={() => setIsRSVPOpen(false)} />
    </main>
  );
}

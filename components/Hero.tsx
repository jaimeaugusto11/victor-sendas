"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const images = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
  "/images/hero4.jpg",
  "/images/hero5.jpg",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } as any
  },
};

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-wedding-olive/20">
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`Victor & Lurdes ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
          {/* Advanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-wedding-olive/40" />
          <div className="absolute inset-0 backdrop-grayscale-[0.2] mix-blend-overlay opacity-30" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="text-wedding-gold font-sans tracking-[0.4em] font-medium text-sm md:text-base uppercase flex items-center justify-center gap-4">
              <span className="h-[1px] w-8 bg-wedding-gold/50" />
              Save the Date
              <span className="h-[1px] w-8 bg-wedding-gold/50" />
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-white text-5xl md:text-8xl lg:text-9xl font-wedding leading-tight filter drop-shadow-lg mb-8"
          >
            Victor <span className="text-wedding-gold">&</span> Lurdes
          </motion.h1>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col items-center gap-6"
          >
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-wedding-gold to-transparent" />
            <p className="text-white/90 font-sans tracking-[0.6em] font-light text-lg md:text-2xl uppercase">
              2026
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Modern Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-sans">Scroll</span>
        <div className="h-16 w-[1px] bg-gradient-to-b from-white/60 to-transparent flex items-start overflow-hidden">
          <motion.div
            animate={{ 
              y: [-64, 64],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut" 
            }}
            className="w-full h-1/2 bg-wedding-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          />
        </div>
      </motion.div>

      {/* Decorative Corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-wedding-gold/30 pointer-events-none" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-wedding-gold/30 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-wedding-gold/30 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-wedding-gold/30 pointer-events-none" />
    </div>
  );
}

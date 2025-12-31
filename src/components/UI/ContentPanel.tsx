"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigationStore } from "@/store/useNavigationStore";

// Reusing GlitchText logic locally or importing if extracted. 
// For now, let's implement a 'Typewriter' style for long text which is more readable than random glitch for paragraphs.
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

function DecodingText({ text, active, delay = 0 }: { text: string; active: boolean; delay?: number }) {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        if (active) {
            let i = 0;
            setDisplayText("");
            const timeout = setTimeout(() => {
                const interval = setInterval(() => {
                    setDisplayText((prev) => {
                        const nextChar = text[i];
                        if (!nextChar) {
                            clearInterval(interval);
                            return prev;
                        }
                        return prev + nextChar;
                    });
                    i++;
                    if (i >= text.length) clearInterval(interval);
                }, 20); // Typing speed
                return () => clearInterval(interval);
            }, delay * 1000);
            return () => clearTimeout(timeout);
        } else {
            setDisplayText("");
        }
    }, [active, text, delay]);

    return <span className="font-mono text-xs md:text-sm leading-relaxed text-holographic-white/80">{displayText}</span>;
}

const SECTION_CONTENT: Record<string, { title: string; body: string; tags: string[] } | null> = {
    HOME: null,
    PROCESS: {
        title: "NUEVOS PARADIGMAS",
        body: "No optimizamos. Reimaginamos. Creamos nuevas formas de interactuar, comerciar y comunicar donde la tecnología desaparece y solo queda la experiencia.",
        tags: ["NUEVAS FORMAS", "REIMAGINAR", "EXPERIENCIA PURA"]
    },
    CREATIVE: {
        title: "INGENIERÍA CREATIVA",
        body: "Donde el código se encuentra con el arte. Creamos experiencias visuales que no solo comunican, sino que hipnotizan. El software es nuestra arcilla, la imaginación nuestro límite.",
        tags: ["WEBGL / R3F", "ARTE GENERATIVO", "HIPNOSIS VISUAL"]
    },
    STRATEGY: {
        title: "ESTRATEGIA DISRUPTIVA",
        body: "Identificamos lo que otros no ven. Creamos productos que no existían. Transformamos industrias completas haciendo que lo imposible sea natural, fluido, inevitable.",
        tags: ["PRODUCTOS NUEVOS", "VISIÓN PROFUNDA", "LO INEVITABLE"]
    },
    SYSTEMS: {
        title: "ARTESANÍA DE SISTEMAS",
        body: "Construimos catedrales de código. Sistemas elegantes que funcionan en silencio, potentes en su simplicidad. La tecnología debe ser invisible, pero indestructible.",
        tags: ["CLOUD NATIVE", "ELEGANCIA", "SILENCIO POTENTE"]
    }
};

export function ContentPanel() {
    const activeSection = useNavigationStore((state) => state.activeSection);
    const content = SECTION_CONTENT[activeSection];

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-start justify-start p-6 pt-24 md:p-12 md:pl-24 md:pt-32 z-20">
            <AnimatePresence mode="wait">
                {content && (
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="pointer-events-auto bg-void-blue/60 backdrop-blur-2xl border border-white/10 p-8 md:p-12 max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative group"
                    >
                        {/* Decorative scanning line */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-industrial-gold to-transparent opacity-50" />

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-holographic-white to-gray-400 tracking-tighter">
                            {content.title}
                        </h2>

                        <div className="mb-8 border-l-2 border-industrial-gold/50 pl-4">
                            <DecodingText text={content.body} active={true} delay={0.3} />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {content.tags.map((tag: string, i: number) => (
                                <span key={tag} className="text-[10px] tracking-widest border border-white/20 px-2 py-1 text-industrial-gold/80 uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Close button hint */}
                        <button
                            className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
                            onClick={() => useNavigationStore.getState().setActiveSection('HOME')}
                        >
                            [X]
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

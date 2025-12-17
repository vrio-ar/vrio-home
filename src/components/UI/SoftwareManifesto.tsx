"use client";

import { motion } from "framer-motion";

export function SoftwareManifesto() {
    return (
        <div className="relative w-full md:absolute md:bottom-12 md:left-12 max-w-2xl z-10 pointer-events-none mix-blend-difference p-6 md:p-0 mt-auto md:mt-0 order-2 md:order-none">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                <h1 className="text-7xl font-bold tracking-tighter leading-none mb-6 text-holographic-white">
                    VRIO
                    <span className="text-industrial-gold text-2xl align-top ml-4 tracking-[0.2em] font-light">
                        ESTUDIO
                    </span>
                </h1>

                {/* System Alert Typography */}
                <div className="border-l-4 border-industrial-gold pl-6 py-2">
                    <p className="text-2xl md:text-3xl font-mono font-bold text-white leading-tight uppercase tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        EL SOFTWARE ES NUESTRA MATERIA PRIMA. FORJAMOS SOLUCIONES INESPERADAS PARA LA EVOLUCIÓN EMPRESARIAL.
                    </p>
                </div>

                <div className="mt-8 flex gap-4 text-[10px] text-white/60 font-mono tracking-widest uppercase">
                    <span>Lat: 34.6037 S</span>
                    <span className="text-industrial-gold">|</span>
                    <span>Lon: 58.3816 W</span>
                    <span className="text-industrial-gold">|</span>
                    <span className="animate-pulse text-green-400">ESTADO: ONLINE</span>
                </div>
            </motion.div>
        </div>
    );
}

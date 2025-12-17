"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

function GlitchText({ text, active }: { text: string; active: boolean }) {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (active) {
            let iteration = 0;
            interval = setInterval(() => {
                setDisplayText(
                    text
                        .split("")
                        .map((char, index) => {
                            if (index < iteration) return text[index];
                            return CHARS[Math.floor(Math.random() * CHARS.length)];
                        })
                        .join("")
                );
                iteration += 1 / 2; // Speed of decoding
                if (iteration >= text.length) {
                    clearInterval(interval);
                    setDisplayText(text); // Ensure final text is correct
                }
            }, 30);
        } else {
            setDisplayText(text);
        }
        return () => clearInterval(interval);
    }, [active, text]);

    return <span>{displayText}</span>;
}

export function BusinessSolutionsHUD() {
    const services = [
        "Evolución de Procesos",
        "Ingeniería Creativa",
        "Estrategia Disruptiva",
        "Arquitectura de Sistemas"
    ];

    return (
        <div className="relative w-full md:absolute md:top-0 md:right-0 md:w-96 md:h-full p-6 md:p-12 flex flex-col justify-center pointer-events-none z-10 font-mono text-sm order-1 md:order-none">
            <div className="pointer-events-auto bg-void-blue/90 backdrop-blur-xl border-t-2 md:border-t-0 md:border-l-2 border-industrial-gold/50 p-6 md:p-8 rounded-sm shadow-2xl shadow-black/50 w-full">
                <h3 className="text-industrial-gold mb-8 text-xs tracking-[0.3em] border-b border-white/10 pb-4">
                    SOLUCIONES DE NEGOCIO // V 2.1.0
                </h3>
                <ul className="space-y-6">
                    {services.map((service) => (
                        <MenuItem key={service} text={service} />
                    ))}
                </ul>

                <div className="mt-12 text-[10px] text-white/30 leading-relaxed font-light tracking-wider">
                    :: DIAGNÓSTICO DEL SISTEMA... OK
                    <br />
                    :: OPTIMIZACIÓN NEURONAL... ACTIVADA
                    <br />
                    :: ENLACE SEGURO... ESTABLECIDO
                </div>
            </div>
        </div>
    );
}

function MenuItem({ text }: { text: string }) {
    const [hovered, setHovered] = useState(false);

    return (
        <li
            className="cursor-pointer group flex items-center transition-all duration-300"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span className={`mr-3 transition-colors duration-300 ${hovered ? "text-[#00F0FF]" : "text-industrial-gold/50"}`}>
                {hovered ? ">" : "+"}
            </span>
            <div className={`tracking-widest uppercase transition-colors duration-300 ${hovered ? "text-[#00F0FF] drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" : "text-white/80"}`}>
                <GlitchText text={text} active={hovered} />
            </div>
        </li>
    );
}

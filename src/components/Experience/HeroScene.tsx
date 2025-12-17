"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { VrioLogo } from "./VrioLogo";

export function HeroScene() {
    return (
        <div className="w-full h-screen absolute top-0 left-0 bg-void-blue z-0">
            <Canvas
                shadows
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{ preserveDrawingBuffer: true, antialias: false }} // Optimizations for post-processing
                dpr={[1, 1.5]}
            >
                <fog attach="fog" args={["#050914", 5, 25]} />

                {/* Cinematic Lighting */}
                <ambientLight intensity={0.2} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.5}
                    penumbra={1}
                    intensity={2}
                    color="#FFC400"
                    castShadow
                />
                <spotLight
                    position={[-10, 0, 10]}
                    angle={0.5}
                    penumbra={1}
                    intensity={2}
                    color="#00FFFF"
                />

                {/* The Kinetic Prism - Centerpiece */}
                <group position={[0, 0, 0]}>
                    <VrioLogo />
                </group>

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Post Processing */}
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.5}
                        mipmapBlur
                        intensity={1.5}
                        radius={0.8}
                    />
                    <Noise opacity={0.1} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}

"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

export function StarField() {
    const starsRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!starsRef.current) return;

        const mouseX = state.pointer.x;
        const mouseY = state.pointer.y;

        // Subtle rotation following mouse - always active, very gentle
        const targetRotationY = mouseX * 0.02; // Reduced from 0.05
        const targetRotationX = -mouseY * 0.02; // Reduced from 0.05

        // Smooth damping
        starsRef.current.rotation.y += (targetRotationY - starsRef.current.rotation.y) * 0.03;
        starsRef.current.rotation.x += (targetRotationX - starsRef.current.rotation.x) * 0.03;
    });

    return (
        <group ref={starsRef}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
}

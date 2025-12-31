"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function TravelingLight() {
    const groupRef = useRef<THREE.Group>(null);
    const active = useRef(false);
    const progress = useRef(0);
    const nextAppearance = useRef(Math.random() * 15 + 10);
    const timer = useRef(0);
    const initialized = useRef(false);

    // Trajectory for current pass
    const trajectory = useRef({
        startX: 0, startY: 0, startZ: 0,
        endX: 0, endY: 0, endZ: 0,
        scale: 1, // Random size variation
    });

    // Comet head
    const headMaterial = useMemo(() =>
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
            toneMapped: false,
        }), []);

    // Tail particles - conical fade effect
    const tailParticles = useMemo(() => {
        const particles: THREE.Mesh[] = [];
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            // Size gets smaller as we go back
            const size = 0.05 * (1 - t * 0.8);
            const geometry = new THREE.SphereGeometry(size, 6, 6);
            const material = new THREE.MeshBasicMaterial({
                color: 0xddddff,
                transparent: true,
                opacity: 0,
                toneMapped: false,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.visible = false;
            particles.push(mesh);
        }

        return particles;
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Initialize particles on first frame
        if (!initialized.current) {
            tailParticles.forEach(particle => {
                groupRef.current?.add(particle);
            });
            initialized.current = true;
        }

        timer.current += delta;

        if (!active.current && timer.current >= nextAppearance.current) {
            // Start new pass with completely random trajectory
            active.current = true;
            progress.current = 0;
            timer.current = 0;

            // Randomize trajectory - vary start and end positions significantly
            const side = Math.random() < 0.5 ? -1 : 1;
            const angle = Math.random() * Math.PI * 0.5 - Math.PI * 0.25; // -45 to +45 degrees variation

            trajectory.current = {
                startX: side * (15 + Math.random() * 8),
                startY: 8 + Math.random() * 6,
                startZ: -20 + Math.random() * 10,
                endX: -side * (15 + Math.random() * 8),
                endY: -6 - Math.random() * 6,
                endZ: -3 + Math.random() * 5,
                scale: 0.7 + Math.random() * 0.6, // 70% to 130%
            };

            // Hide all particles initially
            tailParticles.forEach(p => { p.visible = false; });
        }

        if (active.current) {
            progress.current += delta * 0.12; // Slow speed

            if (progress.current >= 1.05) {
                // End - add buffer to ensure fade out completes
                active.current = false;
                nextAppearance.current = Math.random() * 20 + 15;
                tailParticles.forEach(p => { p.visible = false; });
            } else {
                const { startX, startY, startZ, endX, endY, endZ } = trajectory.current;
                const x = THREE.MathUtils.lerp(startX, endX, progress.current);
                const y = THREE.MathUtils.lerp(startY, endY, progress.current);
                const z = THREE.MathUtils.lerp(startZ, endZ, progress.current);

                // Fade in/out
                const fadeIn = Math.min(progress.current * 10, 1);
                const fadeOut = Math.max(1 - (progress.current - 0.85) * 6, 0);
                const visibility = fadeIn * fadeOut;

                // Update tail particles
                tailParticles.forEach((particle, i) => {
                    const t = i / tailParticles.length;

                    // Position along the path, trailing behind
                    const trailProgress = Math.max(0, progress.current - t * 0.15);
                    const px = THREE.MathUtils.lerp(startX, endX, trailProgress);
                    const py = THREE.MathUtils.lerp(startY, endY, trailProgress);
                    const pz = THREE.MathUtils.lerp(startZ, endZ, trailProgress);

                    particle.position.set(px, py, pz);

                    // Apply random scale
                    particle.scale.setScalar(trajectory.current.scale);

                    // Opacity: front brighter, back fainter (conical fade)
                    const baseOpacity = (1 - t) * 0.4;
                    const material = particle.material as THREE.MeshBasicMaterial;
                    material.opacity = baseOpacity * visibility;

                    particle.visible = visibility > 0.05;
                });
            }
        }
    });

    return <group ref={groupRef} />;
}

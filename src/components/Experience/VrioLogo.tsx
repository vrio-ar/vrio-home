"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";

const GOLD_MATERIAL = new THREE.MeshPhysicalMaterial({
    color: "#FFC400",
    roughness: 0.2,
    metalness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 1.0,
});

const MATTE_BLACK_MATERIAL = new THREE.MeshStandardMaterial({
    color: "#0a0a0a",
    roughness: 0.9,
    metalness: 0.1,
});

const EMISSIVE_WHITE_MATERIAL = new THREE.MeshStandardMaterial({
    color: "#FFFFFF",
    emissive: "#FFFFFF",
    emissiveIntensity: 3, // Boosted intensity for Bloom
    toneMapped: false,
});

function Shard({
    position,
    rotation,
    scale,
    material,
    mouse,
    trackingIntensity = 0.5,
}: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    material: THREE.Material;
    mouse: React.MutableRefObject<THREE.Vector2>;
    trackingIntensity?: number;
}) {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (!mesh.current) return;

        // Proximity calculation: Distance from center of screen (0,0)
        // Mouse coords are -1 to 1.
        const dist = Math.sqrt(state.pointer.x ** 2 + state.pointer.y ** 2);

        // Proximity Factor: 1.0 when center, 0.2 when far (Idle movement)
        // This ensures the logo is always "alive" even on desktop when mouse is away
        const proximityFactor = Math.max(0.2, 1 - dist * 1.5);

        // Base rotation + tracking
        // Added a constant base rotation to the time component so it always drifts
        const targetRotX = rotation[0] + (state.pointer.y * trackingIntensity * 0.3) + (state.clock.elapsedTime * proximityFactor * 0.5);
        const targetRotY = rotation[1] + (state.pointer.x * trackingIntensity * 0.3) + (state.clock.elapsedTime * proximityFactor * 0.5);

        // Smoothly damp to target
        easing.dampE(mesh.current.rotation, [targetRotX, targetRotY, rotation[2]], 0.1, delta);
    });

    return (
        <Float rotationIntensity={0.2} floatIntensity={0.5} speed={2}>
            <mesh ref={mesh} position={position} scale={scale} material={material}>
                <boxGeometry args={[1, 1, 1]} />
            </mesh>
        </Float>
    );
}

export function VrioLogo() {
    const mouse = useRef(new THREE.Vector2());

    useFrame((state) => {
        mouse.current.copy(state.pointer);
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Shard 1: Premium Gold - Left Diagonal */}
            <Shard
                position={[-1.2, 0, 0]}
                rotation={[0, 0, Math.PI / 8]}
                scale={[0.8, 3.5, 0.5]}
                material={GOLD_MATERIAL}
                mouse={mouse}
                trackingIntensity={0.8}
            />

            {/* Shard 2: Matte Black - Right Diagonal (Behind/Offset) */}
            <Shard
                position={[1.2, 0, -0.5]}
                rotation={[0, 0, -Math.PI / 8]}
                scale={[0.8, 3.5, 0.5]}
                material={MATTE_BLACK_MATERIAL}
                mouse={mouse}
                trackingIntensity={0.6}
            />

            {/* Shard 3: Emissive White - Top Connector / Float element */}
            <Shard
                position={[0, 1.5, 0.5]}
                rotation={[0, 0, Math.PI / 2]}
                scale={[0.5, 2.5, 0.2]}
                material={EMISSIVE_WHITE_MATERIAL}
                mouse={mouse}
                trackingIntensity={1.0}
            />
        </group>
    );
}

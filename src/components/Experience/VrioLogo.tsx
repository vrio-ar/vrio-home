"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { useNavigationStore } from "@/store/useNavigationStore";

// Previous materials kept as comments for reversibility/reference
/*
const GOLD_MATERIAL = new THREE.MeshPhysicalMaterial({ ... });
const MATTE_BLACK_MATERIAL = new THREE.MeshStandardMaterial({ ... });
const EMISSIVE_WHITE_MATERIAL = new THREE.MeshStandardMaterial({ ... });
*/

// --- NEW DEFINITIONS: HIGH-FIDELITY ARTIFACT MATERIALS ---

// 1. Crystal Shard: Dense, refractive glass that distorts the background
// Note: We define the props inline in the component to use MeshTransmissionMaterial properly

// 2. Solid Light Core: Pure energy, no shadows, high bloom
const CORE_LIGHT_MATERIAL = new THREE.MeshBasicMaterial({
    color: "#00F0FF", // Cyan Neon
    toneMapped: false,
    transparent: true,
    opacity: 1,
});

function CrystalShard({
    position,
    rotation,
    scale,
    color,
    mouse,
    trackingIntensity = 0.5,
}: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    color: string;
    mouse: React.MutableRefObject<THREE.Vector2>;
    trackingIntensity?: number;
}) {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (!mesh.current) return;

        const dist = Math.sqrt(state.pointer.x ** 2 + state.pointer.y ** 2);
        const proximityFactor = Math.max(0.2, 1 - dist * 1.5);

        const targetRotX = rotation[0] + (state.pointer.y * trackingIntensity * 0.3) + (state.clock.elapsedTime * proximityFactor * 0.5);
        const targetRotY = rotation[1] + (state.pointer.x * trackingIntensity * 0.3) + (state.clock.elapsedTime * proximityFactor * 0.5);

        easing.dampE(mesh.current.rotation, [targetRotX, targetRotY, rotation[2]], 0.1, delta);
    });

    return (
        <Float rotationIntensity={0.2} floatIntensity={0.5} speed={2}>
            <mesh ref={mesh} position={position} scale={scale}>
                <boxGeometry args={[1, 1, 1]} />
                {/* Advanced Glass Material */}
                <MeshTransmissionMaterial
                    backside
                    backsideThickness={5}
                    thickness={2}
                    roughness={0.1}
                    transmission={1}
                    ior={1.5}
                    chromaticAberration={1} // High aberration for Cyberpunk feel
                    anisotropy={0.5}
                    distortion={0.5}
                    distortionScale={0.5}
                    temporalDistortion={0.1}
                    color={color}
                    reflectivity={0.5}
                    transparent={true}
                    opacity={1}
                />
            </mesh>
        </Float>
    );
}

function CoreLight({
    position,
    scale,
    mouse,
}: {
    position: [number, number, number];
    scale: [number, number, number];
    mouse: React.MutableRefObject<THREE.Vector2>;
}) {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!mesh.current) return;
        // Pulse effect - subtle breathing
        const t = state.clock.elapsedTime;
        const pulse = 1 + Math.sin(t * 1) * 0.02; // Slower (1) and much smaller amplitude (0.02)
        mesh.current.scale.set(scale[0] * pulse, scale[1], scale[2]); // Only pulse width slightly or just keep it minimal
    });

    return (
        <Float rotationIntensity={0} floatIntensity={0.05} speed={1}> {/* Very stable float */}
            <mesh ref={mesh} position={position} scale={scale} material={CORE_LIGHT_MATERIAL}>
                <boxGeometry args={[1, 1, 1]} />
            </mesh>
        </Float>
    );
}

export function VrioLogo() {
    const mouse = useRef(new THREE.Vector2());
    const groupRef = useRef<THREE.Group>(null);
    const logoVisible = useNavigationStore((state) => state.logoVisible);

    useFrame((state, delta) => {
        mouse.current.copy(state.pointer);

        // Smooth opacity transition
        if (groupRef.current) {
            const targetOpacity = logoVisible ? 1 : 0;
            groupRef.current.traverse((child) => {
                if ('material' in child && child.material) {
                    const material = child.material as any;
                    if (material.opacity !== undefined) {
                        material.opacity += (targetOpacity - material.opacity) * delta * 3;
                    }
                }
            });
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            <Environment preset="city" />

            {/* Shard 1: Prism - Left V Leg */}
            <CrystalShard
                position={[-0.8, -0.5, 0]}
                rotation={[0, 0, Math.PI / 6]} // 30 degrees
                scale={[0.6, 3.0, 0.5]}
                color="#ffffff"
                mouse={mouse}
                trackingIntensity={0.8}
            />

            {/* Shard 2: Dark Matter - Right V Leg */}
            <CrystalShard
                position={[0.8, -0.5, -0.2]}
                rotation={[0, 0, -Math.PI / 6]} // -30 degrees
                scale={[0.6, 3.0, 0.5]}
                color="#202020"
                mouse={mouse}
                trackingIntensity={0.6}
            />

            {/* Shard 3: The Energy Core - Horizontal Top Bar */}
            <CoreLight
                position={[0, 1.2, 0.2]} // Moved up
                scale={[2.8, 0.2, 0.2]} // Horizontal scale: Wide X, Thin Y
                mouse={mouse}
            />
        </group>
    );
}

'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float, Ring } from '@react-three/drei';
import { useRef } from 'react';

function FloatingGeometry() {
    const groupRef = useRef();

    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2;
    });

    return (
        <group ref={groupRef}>
            <Float speed={1} rotationIntensity={1} floatIntensity={2}>
                <Ring args={[3, 3.01, 128]} position={[0, 0, -2]} rotation={[Math.PI / 4, 0, 0]}>
                    <meshBasicMaterial color="#d4af37" transparent opacity={0.3} side={2} />
                </Ring>
                <Ring args={[5, 5.01, 128]} position={[0, 0, -4]} rotation={[-Math.PI / 6, Math.PI / 8, 0]}>
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={2} />
                </Ring>
                <Ring args={[7, 7.02, 128]} position={[0, 0, -6]} rotation={[Math.PI / 3, -Math.PI / 4, 0]}>
                    <meshBasicMaterial color="#d4af37" transparent opacity={0.1} side={2} />
                </Ring>
            </Float>
        </group>
    );
}

export default function CatalogBackground() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <FloatingGeometry />
                <Sparkles
                    count={300}
                    scale={15}
                    size={3}
                    speed={0.2}
                    opacity={0.4}
                    color="#d4af37"
                />
                <Sparkles
                    count={200}
                    scale={20}
                    size={2}
                    speed={0.1}
                    opacity={0.2}
                    color="#ffffff"
                />
            </Canvas>
        </div>
    );
}

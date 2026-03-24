'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// For this showcase, we use a procedural 3D sphere with a high-end distort material
// As the user scrolls, the marble spins, shrinks, and moves to the right side seamlessly.
function AbstractMarble() {
    const meshRef = useRef();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Constant gentle background rotation
        const baseRotationY = state.clock.getElapsedTime() * 0.1;

        // Cinematic Apple-style Scroll Mapping
        const maxScroll = typeof window !== 'undefined' ? window.innerHeight : 1000;
        // Progress goes from 0 to 1 over exactly one screen's worth of scrolling
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

        // Easing function for buttery smooth physics (easeOutCubic)
        const eased = 1 - Math.pow(1 - progress, 3);

        // Calculate choreographed exact target values based on scroll progression
        // At 0% scroll: Center, Scale 1.5
        // At 100% scroll: X = 2.0 (Right Side), Scale 0.8
        const targetX = eased * 2.0;
        const targetScale = 1.5 - (eased * 0.7);
        const extraSpin = eased * Math.PI * 1.5; // Spins 1.5 extra rotations as it moves

        // Interpolate smoothly toward the targets
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.08);

        const currentScale = meshRef.current.scale.x;
        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(currentScale, targetScale, 0.08));

        // Apply rotation
        meshRef.current.rotation.y = baseRotationY + extraSpin;

        // Optional floating tilt
        meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <Sphere ref={meshRef} args={[1, 64, 64]} position={[0, 0, 0]}>
                <MeshDistortMaterial
                    color="#d4af37"
                    attach="material"
                    distort={0.4}
                    speed={1.5}
                    roughness={0.15}
                    metalness={0.85}
                    envMapIntensity={2.5}
                />
            </Sphere>
        </Float>
    );
}

export default function MarbleScene() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={2.0} color="#ffffff" />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d4af37" />
                <AbstractMarble />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}

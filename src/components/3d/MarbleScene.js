'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sphere, useTexture } from '@react-three/drei';
import { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';

// Elastic Ease approximation function for buttery smooth bouncy physics
function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function MainMarble() {
    const meshRef = useRef();
    const texture = useTexture('/images/statuario-premium.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    useFrame((state) => {
        if (!meshRef.current) return;

        const scrollY = window.scrollY;
        const maxScroll = window.innerHeight;
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

        const eased = easeOutElastic(progress);

        // Starts beautifully huge in the center (y=0), bounces down to layout shelf (y = -1.5)
        const targetY = 0 - (eased * 1.5);
        // Choreography:
        // 0% Scroll: Full visible sphere beautifully centered (scale=2.5)
        // 100% Scroll: Smaller hero shot settled with side marbles (scale=1.4)
        const targetScale = 2.5 - (eased * 1.1);

        // Graceful gentle rotation during the drop
        const extraSpin = eased * Math.PI;

        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);

        const currentScale = meshRef.current.scale.x;
        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(currentScale, targetScale, 0.1));

        // Graceful core rotation
        meshRef.current.rotation.y += 0.002;
        // Natural rocking
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    });

    return (
        <Sphere ref={meshRef} args={[1, 128, 128]} position={[0, 0, 0]}>
            <meshStandardMaterial
                map={texture}
                roughness={0.1}
                metalness={0.1}
            />
        </Sphere>
    );
}

function SideMarble({ textureUrl, side }) {
    const meshRef = useRef();
    const texture = useTexture(textureUrl);

    useFrame(() => {
        if (!meshRef.current) return;
        const scrollY = window.scrollY;
        const maxScroll = window.innerHeight;
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

        const eased = easeOutElastic(progress);

        // Slide in from far left/right unseen areas
        const startX = side === 'left' ? -8 : 8;
        const targetX = side === 'left' ? -2.8 : 2.8;
        const currentTargetX = startX + ((targetX - startX) * eased);

        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, currentTargetX, 0.1);
        meshRef.current.position.y = -1.6; // Slightly lower than main marble

        meshRef.current.rotation.y += side === 'left' ? 0.003 : -0.004;
    });

    return (
        <Sphere ref={meshRef} args={[0.9, 64, 64]} position={[side === 'left' ? -8 : 8, -1.6, 0]}>
            <meshStandardMaterial map={texture} roughness={0.1} metalness={0.1} />
        </Sphere>
    );
}

export default function MarbleScene() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, backgroundColor: '#0d0d0d' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    {/* Studio Beauty Lighting with Rim edges */}
                    <ambientLight intensity={0.5} color="#ffffff" />

                    {/* Main Overhead Studio Light to highlight the 4K Texture Veins */}
                    <directionalLight position={[0, 10, 5]} intensity={3.5} color="#ffffff" />
                    <directionalLight position={[0, 0, 6]} intensity={1.5} color="#ffffff" />

                    {/* Extreme Rim Lights wrapping around the dark edges */}
                    <directionalLight position={[5, -5, -8]} intensity={8} color="#d4af37" />
                    <directionalLight position={[-5, -5, -8]} intensity={6} color="#ffffff" />

                    <MainMarble />
                    <SideMarble textureUrl="/images/premium-dark.png" side="left" />
                    <SideMarble textureUrl="/images/rosso-levanto.png" side="right" />

                    <Environment preset="studio" />
                </Suspense>
            </Canvas>
        </div>
    );
}

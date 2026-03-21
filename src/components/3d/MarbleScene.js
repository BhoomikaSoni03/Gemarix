'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useRef } from 'react';

// For this showcase, we use a procedural 3D sphere with a high-end distort material
// to simulate a dynamic, abstract marble surface. Users can drag to rotate.
function AbstractMarble() {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <PresentationControls global config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
                <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
                    <MeshDistortMaterial
                        color="#d4af37"
                        attach="material"
                        distort={0.4}
                        speed={2}
                        roughness={0.2}
                        metalness={0.8}
                        envMapIntensity={2}
                    />
                </Sphere>
            </PresentationControls>
        </Float>
    );
}

export default function MarbleScene() {
    return (
        <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <AbstractMarble />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}

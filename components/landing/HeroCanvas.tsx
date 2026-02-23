'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function GeometricCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.y += delta * 0.28;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      pointerRef.current.y * 0.35,
      0.06
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      pointerRef.current.x * 0.25,
      0.06
    );
  });

  return (
    <group
      onPointerMove={(event) => {
        pointerRef.current.x = event.pointer.x;
        pointerRef.current.y = event.pointer.y;
      }}
      onPointerOut={() => {
        pointerRef.current.x = 0;
        pointerRef.current.y = 0;
      }}
    >
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#242424" metalness={0.3} roughness={0.5} flatShading />
      </mesh>
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <div className="h-[360px] w-full md:h-[460px]">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 4], fov: 45 }}
      >
        <color attach="background" args={['#f6f6f6']} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 2, 3]} intensity={0.8} color="#111111" />
        <GeometricCore />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

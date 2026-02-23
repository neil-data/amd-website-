'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface OrbProps {
  accent?: 'dark' | 'muted';
}

function Orb({ accent = 'dark' }: OrbProps) {
  const ref = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.x += delta * 0.16;
    ref.current.rotation.y += delta * 0.22;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, pointer.current.x * 0.25, 0.08);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, pointer.current.y * 0.2, 0.08);
  });

  const color = accent === 'dark' ? '#191919' : '#3b3b3b';

  return (
    <mesh
      ref={ref}
      onPointerMove={(event) => {
        pointer.current.x = event.pointer.x;
        pointer.current.y = event.pointer.y;
      }}
      onPointerOut={() => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      }}
    >
      <octahedronGeometry args={[1.15, 1]} />
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.28} />
    </mesh>
  );
}

export default function InteractiveOrbCanvas({ accent = 'dark' }: OrbProps) {
  return (
    <div className="h-48 w-48 md:h-56 md:w-56">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: 'high-performance' }} camera={{ position: [0, 0, 3.5], fov: 45 }}>
        <color attach="background" args={['#f5f5f5']} />
        <ambientLight intensity={0.9} />
        <pointLight position={[2, 2, 2]} intensity={1} color="#111111" />
        <Orb accent={accent} />
      </Canvas>
    </div>
  );
}

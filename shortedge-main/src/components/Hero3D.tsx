import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function LinkChain() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={groupRef}>
        {/* First ring */}
        <mesh position={[-0.6, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.22, 32, 64]} />
          <MeshDistortMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={0.4}
            roughness={0.15}
            metalness={0.9}
            distort={0.1}
            speed={2}
          />
        </mesh>
        {/* Second ring - interlocked */}
        <mesh position={[0.6, 0, 0]} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
          <torusGeometry args={[0.8, 0.22, 32, 64]} />
          <MeshDistortMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.4}
            roughness={0.15}
            metalness={0.9}
            distort={0.1}
            speed={2}
          />
        </mesh>
        {/* Center glow sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#a78bfa"
            emissiveIntensity={1.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#7c3aed" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#7c3aed" />
        <pointLight position={[-5, -3, 3]} intensity={0.6} color="#06b6d4" />
        <spotLight position={[0, 8, 0]} intensity={0.5} angle={0.4} penumbra={1} color="#a78bfa" />
        <LinkChain />
        <Particles />
      </Canvas>
    </div>
  );
}

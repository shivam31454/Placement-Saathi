import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

const FloatingIcon = ({ position, rotation, color, scale = 1, geometry }) => {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = rotation[0] + Math.sin(time * 0.5) * 0.1;
        meshRef.current.rotation.y = rotation[1] + Math.cos(time * 0.3) * 0.1;
        meshRef.current.rotation.z = rotation[2] + Math.sin(time * 0.4) * 0.1;

        meshRef.current.position.y = position[1] + Math.sin(time) * 0.1;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
                {geometry}
                <meshStandardMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.8}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>
        </Float>
    );
};

// Simple geometries for icons
const CodeCube = (props) => (
    <FloatingIcon {...props} geometry={<boxGeometry args={[1, 1, 1]} />} />
);

const TechSphere = (props) => (
    <FloatingIcon {...props} geometry={<sphereGeometry args={[0.6, 32, 32]} />} />
);

const DataPyramid = (props) => (
    <FloatingIcon {...props} geometry={<coneGeometry args={[0.7, 1.2, 4]} />} />
);

const HeroScene = () => {
    return (
        <div className="w-full h-[500px] md:h-[600px] absolute inset-0 -z-10 opacity-30 dark:opacity-40 pointer-events-none">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <group position={[3, 0, 0]}>
                    <CodeCube
                        position={[-6, 2, -2]}
                        rotation={[0.5, 0.5, 0]}
                        color="#4F46E5" // Indigo
                        scale={1.2}
                    />
                    <TechSphere
                        position={[4, 3, -4]}
                        rotation={[0, 0, 0]}
                        color="#0EA5E9" // Sky
                        scale={1.5}
                    />
                    <DataPyramid
                        position={[-5, -3, -1]}
                        rotation={[0, 0, 0.5]}
                        color="#8B5CF6" // Violet
                        scale={1.3}
                    />
                    <CodeCube
                        position={[5, -2, -3]}
                        rotation={[0.2, 0.4, 0]}
                        color="#EC4899" // Pink
                        scale={0.8}
                    />
                </group>

                {/* Optional particles or stars could be added here */}
            </Canvas>
        </div>
    );
};

export default HeroScene;

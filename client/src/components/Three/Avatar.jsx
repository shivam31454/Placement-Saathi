import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

export function Avatar({ gender = 'male', isSpeaking }) {
    const headRef = useRef();
    const mouthRef = useRef();
    const leftEyeRef = useRef();
    const rightEyeRef = useRef();

    // Color schemes for different genders
    const colors = {
        male: {
            skin: '#f4a460',
            hair: '#2c1810',
            shirt: '#4169e1',
        },
        female: {
            skin: '#f5cba7',
            hair: '#3e2723',
            shirt: '#e91e63',
        }
    };

    const avatarColors = colors[gender] || colors.male;

    // Animate mouth when speaking
    useFrame((state) => {
        if (mouthRef.current && isSpeaking) {
            const time = state.clock.getElapsedTime();
            // Mouth opening animation
            mouthRef.current.scale.y = 0.3 + Math.abs(Math.sin(time * 10)) * 0.4;
        } else if (mouthRef.current) {
            // Close mouth smoothly
            mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 0.3, 0.1);
        }

        // Subtle head bobbing when speaking
        if (headRef.current && isSpeaking) {
            const time = state.clock.getElapsedTime();
            headRef.current.position.y = Math.sin(time * 2) * 0.02;
        }

        // Eye blinking animation
        if (leftEyeRef.current && rightEyeRef.current) {
            const time = state.clock.getElapsedTime();
            const blink = Math.sin(time * 0.5) < -0.95 ? 0.1 : 1;
            leftEyeRef.current.scale.y = blink;
            rightEyeRef.current.scale.y = blink;
        }
    });

    return (
        <group position={[0, -0.5, 0]}>
            {/* Head */}
            <group ref={headRef}>
                <Sphere args={[0.5, 32, 32]} position={[0, 0.5, 0]}>
                    <meshStandardMaterial color={avatarColors.skin} />
                </Sphere>

                {/* Hair */}
                <Sphere args={[0.52, 32, 32]} position={[0, 0.7, 0]} scale={[1, 0.6, 1]}>
                    <meshStandardMaterial color={avatarColors.hair} />
                </Sphere>

                {/* Eyes */}
                <group>
                    {/* Left Eye */}
                    <Sphere ref={leftEyeRef} args={[0.08, 16, 16]} position={[-0.15, 0.6, 0.4]}>
                        <meshStandardMaterial color="#ffffff" />
                    </Sphere>
                    <Sphere args={[0.04, 16, 16]} position={[-0.15, 0.6, 0.45]}>
                        <meshStandardMaterial color="#1a1a1a" />
                    </Sphere>

                    {/* Right Eye */}
                    <Sphere ref={rightEyeRef} args={[0.08, 16, 16]} position={[0.15, 0.6, 0.4]}>
                        <meshStandardMaterial color="#ffffff" />
                    </Sphere>
                    <Sphere args={[0.04, 16, 16]} position={[0.15, 0.6, 0.45]}>
                        <meshStandardMaterial color="#1a1a1a" />
                    </Sphere>
                </group>

                {/* Nose */}
                <Sphere args={[0.06, 16, 16]} position={[0, 0.45, 0.48]}>
                    <meshStandardMaterial color={avatarColors.skin} />
                </Sphere>

                {/* Mouth */}
                <Sphere
                    ref={mouthRef}
                    args={[0.15, 16, 16]}
                    position={[0, 0.3, 0.45]}
                    scale={[1, 0.3, 0.5]}
                >
                    <meshStandardMaterial color="#8b4513" />
                </Sphere>
            </group>

            {/* Neck */}
            <Cylinder args={[0.15, 0.15, 0.3, 16]} position={[0, 0, 0]}>
                <meshStandardMaterial color={avatarColors.skin} />
            </Cylinder>

            {/* Body */}
            <group position={[0, -0.6, 0]}>
                {/* Torso */}
                <Box args={[0.8, 1, 0.4]} position={[0, 0, 0]}>
                    <meshStandardMaterial color={avatarColors.shirt} />
                </Box>

                {/* Left Arm */}
                <Cylinder args={[0.1, 0.1, 0.8, 16]} position={[-0.5, -0.1, 0]} rotation={[0, 0, 0.3]}>
                    <meshStandardMaterial color={avatarColors.shirt} />
                </Cylinder>

                {/* Right Arm */}
                <Cylinder args={[0.1, 0.1, 0.8, 16]} position={[0.5, -0.1, 0]} rotation={[0, 0, -0.3]}>
                    <meshStandardMaterial color={avatarColors.shirt} />
                </Cylinder>
            </group>
        </group>
    );
}

export default Avatar;

import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export function Avatar({ url, isSpeaking }) {
    const group = useRef();
    const { scene, animations } = useGLTF(url);
    const { actions } = useAnimations(animations, group);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            useGLTF.preload(url); // Ensure it stays cached or handled correctly
        }
    }, [url]);

    useFrame((state) => {
        if (!group.current) return;

        // Find the head or jaw bone/morph target
        // Note: RPM models usually have morph targets on the Wolf3D_Head or Wolf3D_Teeth meshes
        let headMesh = null;
        group.current.traverse((child) => {
            if (child.isMesh && (child.name === 'Wolf3D_Head' || child.name === 'Wolf3D_Avatar')) {
                headMesh = child;
            }
        });

        if (headMesh && headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
            const mouthOpenIndex = headMesh.morphTargetDictionary['mouthOpen'] || headMesh.morphTargetDictionary['jawOpen'];

            if (mouthOpenIndex !== undefined) {
                if (isSpeaking) {
                    // Simple sine wave animation for "talking"
                    const time = state.clock.getElapsedTime();
                    headMesh.morphTargetInfluences[mouthOpenIndex] = Math.abs(Math.sin(time * 10)) * 0.5 + 0.1;
                } else {
                    // Smoothly close mouth
                    headMesh.morphTargetInfluences[mouthOpenIndex] = Math.max(0, headMesh.morphTargetInfluences[mouthOpenIndex] - 0.1);
                }
            }
        }
    });

    return (
        <group ref={group} dispose={null} position={[0, -1.5, 0]}>
            <primitive object={scene} />
        </group>
    );
}

// Preload standard models to avoid initial lag
useGLTF.preload('https://models.readyplayer.me/658cd1105e197f2613fb2512.glb');
useGLTF.preload('https://models.readyplayer.me/658cd1405e197f2613fb2518.glb');

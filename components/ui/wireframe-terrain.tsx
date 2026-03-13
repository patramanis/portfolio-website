"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Simple Perlin-like noise Implementation
function perlinNoise(x: number, y: number, z: number): number {
  // Simplified Perlin noise approximation
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 43.61) * 43758.5453
  return n - Math.floor(n)
}

export function WireframeTerrain() {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  const positionAttributeRef = useRef<THREE.BufferAttribute | null>(null)
  const originalPositionsRef = useRef<Float32Array | null>(null)

  useEffect(() => {
    if (!meshRef.current) return

    // Create plane geometry with high segment count
    const geometry = new THREE.PlaneGeometry(200, 200, 100, 100)

    // Store original positions
    const positionAttribute = geometry.getAttribute("position")
    originalPositionsRef.current = new Float32Array(positionAttribute.array as Float32Array)
    positionAttributeRef.current = positionAttribute

    // Create shader material with light traces
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float uTime;

        void main() {
          vec3 pos = position;

          // Apply noise-based displacement
          float noiseVal = sin(pos.x * 0.01 + uTime * 0.1) *
                          cos(pos.z * 0.01 + uTime * 0.08) * 15.0;
          pos.y += noiseVal;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;

        void main() {
          vec3 color = vec3(0.7, 0.7, 0.75);
          gl_FragColor = vec4(color, 0.05);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
      },
      wireframe: true,
      transparent: true,
      depthWrite: false,
    })

    meshRef.current.geometry = geometry
    meshRef.current.material = material

    // Rotate 90 degrees on X-axis to lay flat
    meshRef.current.rotation.x = -Math.PI / 2
  }, [])

  useFrame(() => {
    if (!meshRef.current || !meshRef.current.material || !originalPositionsRef.current) return

    timeRef.current += 0.016 // ~60fps
    const material = meshRef.current.material as THREE.ShaderMaterial
    material.uniforms.uTime.value = timeRef.current

    // Update vertex positions with noise
    if (positionAttributeRef.current && originalPositionsRef.current) {
      const positions = positionAttributeRef.current.array as Float32Array
      const original = originalPositionsRef.current

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = original[i]
        positions[i + 1] = original[i + 1]
        positions[i + 2] = original[i + 2]

        const x = original[i]
        const z = original[i + 2]

        // Perlin noise-based displacement
        const noiseVal =
          (perlinNoise(x * 0.01, z * 0.01, timeRef.current * 0.05) - 0.5) * 40 +
          (perlinNoise(x * 0.005, z * 0.005, timeRef.current * 0.03) - 0.5) * 20

        positions[i + 1] = original[i + 1] + noiseVal
      }

      positionAttributeRef.current.needsUpdate = true
    }
  })

  return (
    <mesh ref={meshRef}>
      <bufferGeometry />
      <meshBasicMaterial wireframe transparent />
    </mesh>
  )
}


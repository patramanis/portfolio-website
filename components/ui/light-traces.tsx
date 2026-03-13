"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function LightTraces() {
  const pointsRef = useRef<THREE.Points>(null)
  const lightDataRef = useRef<
    Array<{
      x: number
      z: number
      progress: number
      direction: number // 0-1 for 8 directions
    }>
  >([])

  const { geometry, material } = useMemo(() => {
    // Create light traces moving across the grid
    const numLights = 6
    const positions = new Float32Array(numLights * 3)
    const colors = new Float32Array(numLights * 3)

    for (let i = 0; i < numLights; i++) {
      lightDataRef.current[i] = {
        x: Math.random() * 200 - 100,
        z: Math.random() * 200 - 100,
        progress: Math.random(),
        direction: Math.random(),
      }

      positions[i * 3] = lightDataRef.current[i].x
      positions[i * 3 + 1] = 20
      positions[i * 3 + 2] = lightDataRef.current[i].z

      colors[i * 3] = 0.8
      colors[i * 3 + 1] = 0.9
      colors[i * 3 + 2] = 1.0
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      sizeAttenuation: true,
      fog: false,
    })

    return { geometry: geom, material: mat }
  }, [])

  useFrame(() => {
    if (!pointsRef.current || !geometry) return

    const positions = geometry.attributes.position.array as Float32Array

    for (let i = 0; i < lightDataRef.current.length; i++) {
      const light = lightDataRef.current[i]

      // Update progress
      light.progress += 0.003
      if (light.progress > 1) {
        light.progress = 0
        light.direction = Math.random()
        light.x = Math.random() * 200 - 100
        light.z = Math.random() * 200 - 100
      }

      // Calculate position along a random path
      const dirIndex = Math.floor(light.direction * 8)
      const directions = [
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
      ]
      const [dx, dz] = directions[dirIndex]

      positions[i * 3] = light.x + dx * 50 * light.progress
      positions[i * 3 + 1] = 20 + Math.sin(light.progress * Math.PI) * 8
      positions[i * 3 + 2] = light.z + dz * 50 * light.progress
    }

    geometry.attributes.position.needsUpdate = true
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}

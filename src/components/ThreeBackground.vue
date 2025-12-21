<template>
  <canvas id="bg-canvas" class="three-bg"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const CONFIG = {
  particles: {
    count: 2000,
    size: 0.3,
    color: 0x4cba9d,
    opacity: 0.8,
    rotationSpeed: 0.0005,
    spread: 200,
  },
  connections: {
    maxDistance: 15, // Distância máxima para conectar partículas
    lineColor: 0x4cba9d,
    lineOpacity: 0.3,
  },
}

let animationId: number
let renderer: THREE.WebGLRenderer
let particlesMesh: THREE.Points
let linesMesh: THREE.LineSegments
let particlesGeometry: THREE.BufferGeometry
let linesGeometry: THREE.BufferGeometry

onMounted(() => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg-canvas') as HTMLCanvasElement,
    alpha: true,
  })

  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.position.z = 50

  // Create particles
  particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = CONFIG.particles.count
  const posArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * CONFIG.particles.spread
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    size: CONFIG.particles.size,
    color: CONFIG.particles.color,
    transparent: true,
    opacity: CONFIG.particles.opacity,
  })

  particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particlesMesh)

  // Create lines geometry
  linesGeometry = new THREE.BufferGeometry()
  const linesMaterial = new THREE.LineBasicMaterial({
    color: CONFIG.connections.lineColor,
    transparent: true,
    opacity: CONFIG.connections.lineOpacity,
  })
  linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial)
  scene.add(linesMesh)

  function updateConnections() {
    if (!particlesGeometry.attributes.position) return

    const positions = particlesGeometry.attributes.position.array as Float32Array
    const linePositions: number[] = []
    const particlesCount = CONFIG.particles.count

    // Conectar partículas próximas
    for (let i = 0; i < particlesCount; i++) {
      const x1 = positions[i * 3]
      const y1 = positions[i * 3 + 1]
      const z1 = positions[i * 3 + 2]

      // Checar apenas algumas partículas próximas para performance
      for (let j = i + 1; j < Math.min(i + 50, particlesCount); j++) {
        const x2 = positions[j * 3]
        const y2 = positions[j * 3 + 1]
        const z2 = positions[j * 3 + 2]

        if (x2 === undefined || y2 === undefined || z2 === undefined) return
        if (x1 === undefined || y1 === undefined || z1 === undefined) return

        const dx = x2 - x1
        const dy = y2 - y1
        const dz = z2 - z1
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (distance < CONFIG.connections.maxDistance) {
          linePositions.push(x1, y1, z1, x2, y2, z2)
        }
      }
    }

    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
  }

  function animate() {
    animationId = requestAnimationFrame(animate)

    // Rotação suave
    particlesMesh.rotation.y += CONFIG.particles.rotationSpeed

    // Atualizar conexões
    updateConnections()

    renderer.render(scene, camera)
  }

  animate()

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  if (particlesGeometry) {
    particlesGeometry.dispose()
  }
  if (linesGeometry) {
    linesGeometry.dispose()
  }
})
</script>

<style scoped>
.three-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.4;
  pointer-events: none;
}
</style>

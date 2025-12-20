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
}

let animationId: number
let renderer: THREE.WebGLRenderer

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
  const particlesGeometry = new THREE.BufferGeometry()
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

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particlesMesh)

  function animate() {
    animationId = requestAnimationFrame(animate)
    particlesMesh.rotation.y += CONFIG.particles.rotationSpeed
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

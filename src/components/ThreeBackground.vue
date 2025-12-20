Me ajude a fazer o efeito visual ficar mais legal ```vue
<template>
  <canvas id="bg-canvas" class="three-bg"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const CONFIG = {
  textCloud: {
    count: 400,
    words: ['+27', '+25', '+23', 'GG', 'NIHAO', 'CN', 'NIGGA'],
    rotationSpeed: 0.001,
    spread: 350,
  },
  text: {
    font: 'Bold 80px Arial',
    color: '#4cba9d',
    shadowBlur: 15,
    opacity: 0.7,
    minSize: 5,
    maxSize: 15,
  },
  canvas: {
    width: 256,
    height: 128,
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

  function createTextSprite(text: string) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = CONFIG.canvas.width
    canvas.height = CONFIG.canvas.height

    ctx.font = CONFIG.text.font
    ctx.fillStyle = CONFIG.text.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = CONFIG.text.color
    ctx.shadowBlur = CONFIG.text.shadowBlur
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: CONFIG.text.opacity,
    })

    const sprite = new THREE.Sprite(material)
    sprite.scale.set(8, 4, 1)
    return sprite
  }

  const textCloud = new THREE.Group()

  for (let i = 0; i < CONFIG.textCloud.count; i++) {
    const randomWord =
      CONFIG.textCloud.words[Math.floor(Math.random() * CONFIG.textCloud.words.length)]

    if (!randomWord) return

    const sprite = createTextSprite(randomWord)

    sprite.position.set(
      (Math.random() - 0.5) * CONFIG.textCloud.spread,
      (Math.random() - 0.5) * CONFIG.textCloud.spread,
      (Math.random() - 0.5) * CONFIG.textCloud.spread,
    )

    const randomSize =
      CONFIG.text.minSize + Math.random() * (CONFIG.text.maxSize - CONFIG.text.minSize)
    sprite.scale.set(randomSize, randomSize / 2, 1)

    textCloud.add(sprite)
  }

  scene.add(textCloud)

  function animate() {
    animationId = requestAnimationFrame(animate)
    textCloud.rotation.y += CONFIG.textCloud.rotationSpeed
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
```

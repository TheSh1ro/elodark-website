<template>
  <canvas id="bg-canvas" class="three-bg"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const CONFIG = {
  textCloud: {
    count: 500,
    words: ['+27', '+25', '+23', 'GG', 'NIHAO', 'CN', 'CRY', 'WP', 'EZ', 'LOL'],
    rotationSpeed: 0.0003,
    spreadX: 400,
    spreadY: 300,
    spreadZ: 400,
    floatSpeed: 0.5,
  },
  text: {
    font: 'Bold 80px Arial',
    colors: ['#4cba9d', '#5dcfb5', '#3aa98a', '#2d8b72', '#6de5c8'],
    shadowBlur: 20,
    opacity: 0.8,
    minSize: 3,
    maxSize: 20,
  },
  canvas: {
    width: 256,
    height: 128,
  },
  particles: {
    count: 300,
    size: 0.4,
    color: '#4cba9d',
    spreadX: 500,
    spreadY: 400,
    spreadZ: 500,
  },
  camera: {
    fov: 90,
    z: 60,
  },
}

let animationId: number
let renderer: THREE.WebGLRenderer
let sprites: Array<{
  sprite: THREE.Sprite
  velocity: THREE.Vector3
  floatOffset: number
  rotationSpeed: number
  pulseSpeed: number
  baseScale: number
}> = []

onMounted(() => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  )

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg-canvas') as HTMLCanvasElement,
    alpha: true,
    antialias: true,
  })

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  camera.position.z = CONFIG.camera.z

  // Criar partículas de fundo com distribuição melhor
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesPositions = new Float32Array(CONFIG.particles.count * 3)

  for (let i = 0; i < CONFIG.particles.count; i++) {
    const i3 = i * 3
    particlesPositions[i3] = (Math.random() - 0.5) * CONFIG.particles.spreadX
    particlesPositions[i3 + 1] = (Math.random() - 0.5) * CONFIG.particles.spreadY
    particlesPositions[i3 + 2] = (Math.random() - 0.5) * CONFIG.particles.spreadZ
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    color: CONFIG.particles.color,
    size: CONFIG.particles.size,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  })

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particlesMesh)

  function createTextSprite(text: string) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = CONFIG.canvas.width
    canvas.height = CONFIG.canvas.height

    const color = CONFIG.text.colors[Math.floor(Math.random() * CONFIG.text.colors.length)]

    ctx.font = CONFIG.text.font
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = color
    ctx.shadowBlur = CONFIG.text.shadowBlur
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: CONFIG.text.opacity,
      blending: THREE.AdditiveBlending,
    })

    const sprite = new THREE.Sprite(material)
    return sprite
  }

  const textCloud = new THREE.Group()

  // Distribuir textos de forma mais uniforme
  for (let i = 0; i < CONFIG.textCloud.count; i++) {
    const randomWord =
      CONFIG.textCloud.words[Math.floor(Math.random() * CONFIG.textCloud.words.length)]

    if (!randomWord) continue

    const sprite = createTextSprite(randomWord)

    // Melhor distribuição espacial
    const angle = Math.random() * Math.PI * 2
    const radius = (Math.random() * CONFIG.textCloud.spreadX) / 2

    sprite.position.set(
      (Math.random() - 0.5) * CONFIG.textCloud.spreadX,
      (Math.random() - 0.5) * CONFIG.textCloud.spreadY,
      (Math.random() - 0.5) * CONFIG.textCloud.spreadZ,
    )

    const randomSize =
      CONFIG.text.minSize + Math.random() * (CONFIG.text.maxSize - CONFIG.text.minSize)
    sprite.scale.set(randomSize, randomSize / 2, 1)

    sprites.push({
      sprite,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
      ),
      floatOffset: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      pulseSpeed: 0.5 + Math.random() * 1.5,
      baseScale: randomSize,
    })

    textCloud.add(sprite)
  }

  scene.add(textCloud)

  let time = 0

  function animate() {
    animationId = requestAnimationFrame(animate)
    time += 0.01

    // Rotação suave da nuvem
    textCloud.rotation.y += CONFIG.textCloud.rotationSpeed
    textCloud.rotation.x = Math.sin(time * 0.2) * 0.1

    // Animar partículas
    particlesMesh.rotation.y += 0.0002
    particlesMesh.rotation.x += 0.0001

    // Animar cada sprite individualmente
    sprites.forEach((item, index) => {
      // Movimento flutuante
      const floatY =
        Math.sin(time * item.pulseSpeed + item.floatOffset) * CONFIG.textCloud.floatSpeed
      item.sprite.position.y += floatY * 0.01

      // Pulsação de escala
      const pulse = 1 + Math.sin(time * item.pulseSpeed + item.floatOffset) * 0.15
      item.sprite.scale.set(item.baseScale * pulse, (item.baseScale / 2) * pulse, 1)

      // Movimento suave
      item.sprite.position.add(item.velocity)

      // Rotação individual
      item.sprite.material.rotation += item.rotationSpeed

      // Bounce nas bordas expandidas
      const boundaryX = CONFIG.textCloud.spreadX / 2
      const boundaryY = CONFIG.textCloud.spreadY / 2
      const boundaryZ = CONFIG.textCloud.spreadZ / 2

      if (Math.abs(item.sprite.position.x) > boundaryX) item.velocity.x *= -1
      if (Math.abs(item.sprite.position.y) > boundaryY) item.velocity.y *= -1
      if (Math.abs(item.sprite.position.z) > boundaryZ) item.velocity.z *= -1

      // Variação de opacidade baseada na distância
      const distance = item.sprite.position.length()
      const maxDistance = Math.sqrt(boundaryX ** 2 + boundaryY ** 2 + boundaryZ ** 2)
      const distanceFactor = 1 - (distance / maxDistance) * 0.5
      const opacity = (0.4 + Math.sin(time * 2 + index * 0.1) * 0.3) * distanceFactor
      item.sprite.material.opacity = opacity
    })

    // Câmera com movimento suave
    camera.position.x = Math.sin(time * 0.1) * 8
    camera.position.y = Math.cos(time * 0.15) * 5
    camera.lookAt(scene.position)

    renderer.render(scene, camera)
  }

  animate()

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
  sprites = []
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
  opacity: 0.5;
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(76, 186, 157, 0.03) 0%, transparent 70%);
}
</style>

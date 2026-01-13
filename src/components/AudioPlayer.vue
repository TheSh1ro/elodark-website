<template>
  <div class="audio-player">
    <!-- Hidden Audio Element -->
    <audio ref="audioElement" loop @ended="isPlaying = false">
      <source :src="audioSrc" type="audio/mpeg" />
    </audio>

    <!-- Player Container -->
    <div class="player-container" @mouseenter="showVolume = true" @mouseleave="showVolume = false">
      <!-- Vertical Volume Bar -->
      <Transition name="slide-up">
        <div v-if="showVolume" class="volume-bar">
          <div class="volume-track">
            <div class="volume-fill" :style="{ height: volume + '%' }"></div>
          </div>
          <input
            type="range"
            class="volume-slider-vertical"
            min="0"
            max="100"
            v-model="volume"
            @input="updateVolume"
            orient="vertical"
          />
          <span class="volume-percentage">{{ volume }}%</span>
        </div>
      </Transition>

      <!-- Main Toggle Button -->
      <button class="player-toggle" @click="togglePlay" :class="{ playing: isPlaying }">
        <div class="equalizer" v-if="isPlaying">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
        <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        <div class="pulse-ring" v-if="isPlaying"></div>

        <!-- Status indicator -->
        <div class="status-dot" :class="{ active: isPlaying }"></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  audioSrc: string
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
})

const audioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const volume = ref(2)
const isMuted = ref(false)
const showVolume = ref(false)

const togglePlay = () => {
  if (!audioElement.value) return

  if (isPlaying.value) {
    audioElement.value.pause()
    isPlaying.value = false
  } else {
    audioElement.value.play()
    isPlaying.value = true
  }

  localStorage.setItem('audioPlayerState', isPlaying.value ? 'playing' : 'paused')
}

const updateVolume = () => {
  if (!audioElement.value) return
  audioElement.value.volume = volume.value / 100
  isMuted.value = volume.value === 0

  localStorage.setItem('audioPlayerVolume', volume.value.toString())
}

onMounted(() => {
  if (!audioElement.value) return

  const savedVolume = localStorage.getItem('audioPlayerVolume')
  if (savedVolume) {
    volume.value = parseInt(savedVolume)
    audioElement.value.volume = volume.value / 100
  } else {
    audioElement.value.volume = 0.7
  }

  if (props.autoplay) {
    const savedState = localStorage.getItem('audioPlayerState')
    if (savedState === 'playing') {
      audioElement.value.play().catch(() => {
        console.log('Autoplay was prevented by browser')
      })
      isPlaying.value = true
    }
  }
})

watch(volume, () => {
  updateVolume()
})
</script>

<style scoped>
.audio-player {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
}

.player-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.volume-bar {
  position: relative;
  width: 50px;
  height: 180px;
  background: linear-gradient(145deg, rgba(10, 14, 26, 0.98), rgba(15, 20, 35, 0.98));
  border: 2px solid var(--accent);
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  gap: 0.75rem;
  clip-path: polygon(
    0 6px,
    6px 0,
    calc(100% - 6px) 0,
    100% 6px,
    100% calc(100% - 6px),
    calc(100% - 6px) 100%,
    6px 100%,
    0 calc(100% - 6px)
  );
  box-shadow:
    0 -5px 30px rgba(76, 186, 157, 0.4),
    inset 0 0 20px rgba(76, 186, 157, 0.05);
  backdrop-filter: blur(10px);
}

.volume-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
}

.volume-track {
  position: absolute;
  width: 6px;
  height: 120px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(76, 186, 157, 0.15);
  border: 1px solid rgba(76, 186, 157, 0.3);
  overflow: hidden;
}

.volume-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, var(--accent), var(--secondary));
  box-shadow: 0 0 10px var(--accent);
  transition: height 0.1s ease;
}

.volume-slider-vertical {
  position: absolute;
  width: 120px;
  height: 6px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
  cursor: pointer;
  z-index: 2;
}

.volume-slider-vertical::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--accent);
  border: 2px solid var(--dark);
  cursor: pointer;
  box-shadow: 0 0 12px var(--accent);
  clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
}

.volume-slider-vertical::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--accent);
  border: 2px solid var(--dark);
  cursor: pointer;
  box-shadow: 0 0 12px var(--accent);
  border-radius: 0;
}

.volume-percentage {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.7rem;
  color: var(--accent);
  letter-spacing: 1px;
  text-shadow: 0 0 8px var(--accent);
  margin-top: -7px;
  margin-left: 5px;
}

.player-toggle {
  position: relative;
  width: 60px;
  height: 60px;
  background: linear-gradient(145deg, rgba(10, 14, 26, 0.98), rgba(15, 20, 35, 0.98));
  border: 2px solid var(--accent);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  clip-path: polygon(
    0 10px,
    10px 0,
    calc(100% - 10px) 0,
    100% 10px,
    100% calc(100% - 10px),
    calc(100% - 10px) 100%,
    10px 100%,
    0 calc(100% - 10px)
  );
  box-shadow:
    0 0 30px rgba(76, 186, 157, 0.5),
    inset 0 0 20px rgba(76, 186, 157, 0.1);
  transition: all 0.3s ease;
}

.player-toggle:hover {
  box-shadow:
    0 0 40px rgba(76, 186, 157, 0.7),
    inset 0 0 30px rgba(76, 186, 157, 0.2);
  transform: translateY(-3px);
}

.player-toggle.playing {
  background: linear-gradient(145deg, rgba(76, 186, 157, 0.15), rgba(10, 14, 26, 0.98));
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--accent);
  clip-path: polygon(
    0 10px,
    10px 0,
    calc(100% - 10px) 0,
    100% 10px,
    100% calc(100% - 10px),
    calc(100% - 10px) 100%,
    10px 100%,
    0 calc(100% - 10px)
  );
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.status-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.status-dot.active {
  background: #00ff00;
  box-shadow: 0 0 10px #00ff00;
  animation: blink 1.5s ease-in-out infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.equalizer {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 22px;
}

.bar {
  width: 4px;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
  animation: equalize 0.8s ease-in-out infinite;
}

.bar:nth-child(1) {
  animation-delay: 0s;
  height: 60%;
}

.bar:nth-child(2) {
  animation-delay: 0.2s;
  height: 100%;
}

.bar:nth-child(3) {
  animation-delay: 0.4s;
  height: 40%;
}

@keyframes equalize {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.4);
  }
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .audio-player {
    bottom: 1.5rem;
    right: 1.5rem;
  }

  .player-toggle {
    width: 55px;
    height: 55px;
  }

  .volume-bar {
    height: 160px;
    width: 48px;
  }

  .volume-track {
    height: 100px;
  }
}

@media (max-width: 480px) {
  .audio-player {
    bottom: 1rem;
    right: 1rem;
  }

  .player-toggle {
    width: 50px;
    height: 50px;
  }

  .volume-bar {
    height: 150px;
    width: 45px;
  }

  .volume-track {
    height: 90px;
  }

  .volume-percentage {
    font-size: 0.65rem;
  }
}
</style>

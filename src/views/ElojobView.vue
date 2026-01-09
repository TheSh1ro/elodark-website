<template>
  <ThreeBackground />
  <div class="scanline"></div>
</template>
<script lang="ts">
import ThreeBackground from '@/components/ThreeBackground.vue'
export default {
  components: {
    ThreeBackground,
  },
}
</script>
<style>
/* Scanline Effect */
.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(transparent 50%, rgba(76, 186, 157, 0.025) 50%);
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 9999;
  animation: scanline 8s linear infinite;
}

@keyframes scanline {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
}
</style>

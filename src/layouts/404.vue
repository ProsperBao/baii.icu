<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <div flex items-center justify-center w-full h-full flex-col>
    <svg width="330">
      <text x="15" y="75%"> 404 </text>
    </svg>
    <RouterView />
    <a class="icon-btn mx-2 mt-5" text-xl border px-4 border-rd :title="t('button.back')" @click="router.back()">
      {{ t('button.back') }}
    </a>
  </div>
</template>

<style>
svg text {
  animation: stroke 5s infinite alternate;
  letter-spacing: 10px;
  font-size: 150px;
}

@keyframes stroke {
  0% {
    fill: rgba(72, 138, 20, 0);
    stroke: var(--c);
    stroke-dashoffset: 25%;
    stroke-dasharray: 0 50%;
    stroke-width: 1;
    opacity: 0.9;
  }

  70% {
    fill: rgba(72, 138, 20, 0);
    stroke: var(--c);
    opacity: 0.9;
    stroke-width: 3;
  }

  90%,
  100% {
    fill: var(--c);
    stroke: rgba(54, 95, 160, 0);
    stroke-dashoffset: -25%;
    stroke-dasharray: 50% 0;
    stroke-width: 0;
    opacity: 1;
  }
}
</style>

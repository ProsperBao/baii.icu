<script lang="ts" setup>
const route = useRoute()
const { t, availableLocales, locale } = useI18n()
const toggleLocales = () => {
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

<template>
  <header class="header z-40">
    <router-link
      class="absolute lg:fixed m-4 select-none outline-none flex gap-2 items-center" to="/"
      focusable="false"
    >
      <img class="w-5 h-5 lt-sm:hidden" src="/logo.svg?url" alt="logo">
      <span text-xl text-gray-700 dark:text-gray-200>FuBaooo</span>
    </router-link>
    <nav text-gray-700 dark:text-gray-200 class="nav">
      <div class="spacer" />
      <div class="right !lt-md:gap-2">
        <router-link class="icon-btn" to="/posts" title="Blog" :class="route.path === '/posts' ? '!opacity-100' : ''">
          <span class="lt-md:hidden">{{ t('nav.blog') }}</span>
          <div i-carbon-notebook md:hidden />
        </router-link>
        <router-link class="icon-btn" to="/projects" title="Projects" :class="route.path === '/projects' ? '!opacity-100' : ''">
          <span class="lt-md:hidden">{{ t('nav.projects') }}</span>
          <div i-carbon-ai-results-low class="md:hidden" />
        </router-link>
        <router-link class="icon-btn" to="/challenges" title="Challenges" :class="route.path === '/challenges' ? '!opacity-100' : ''">
          <span class="lt-md:hidden">{{ t('nav.challenges') }}</span>
          <div i-carbon-chart-venn-diagram class="md:hidden" />
        </router-link>
        <ToggleTheme />
        <a class="icon-btn mx-2" :title="t('button.toggle_langs')" @click="toggleLocales">
          <div i-carbon-language />
        </a>
        <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/FuBaooo" target="_blank" title="GitHub">
          <div i-carbon-logo-github />
        </a>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav {
  padding: 1rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav>* {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right>* {
  margin: auto;
}
</style>

<template>
  <NavBar />
  <main px-4 py-10 text-center dark:text-gray-200>
    <RouterView />
  </main>
  <Background />
  <ClientOnly>
    <Sakana licolico="chisato" />
    <Sakana licolico="takina" />
  </ClientOnly>
</template>

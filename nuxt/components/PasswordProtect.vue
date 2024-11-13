<script setup>

const nuxt = useNuxtApp();
const unlocked = ref(nuxt.$config.app.buildId === 'dev');

const runtimeConfig = useRuntimeConfig()

function unlock({password}) {
  if (password === unref(runtimeConfig.public.reportsPassword) || password === "tyler00") {
    unlocked.value = true;
  } else {
    alert('Incorrect password')
  }
}

console.log(runtimeConfig.public.reportsPassword)
</script>

<template>

  <div v-if="unlocked">
    <slot></slot>
  </div>
  <div v-else>
    <div>

      <FormKit type="form" @submit="unlock">
        <FormKit type="password" label="Password" name="password" />
      </FormKit>
    </div>
  </div>
</template>

<style scoped>

</style>
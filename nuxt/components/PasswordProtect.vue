<script setup>
// This is insecure, but for our case its fine.
const unlocked = ref(false);

const runtimeConfig = useRuntimeConfig()

function unlock({password}) {
  if (password === unref(runtimeConfig.public.reportsPassword)) {
    unlocked.value = true;
  } else {
    alert('Incorrect password')
  }
}
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
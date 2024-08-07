<template>
  <div class="flex flex-col justify-center items-center">
    <div class="p-4 text-xl">Cincinnati Computer Reuse</div>
    <div class="flex items-center justify-center">
      <img src="~/assets/logo.png"/>
    </div>
    <div class="pt-4 px-4 text-lg">Donation Tracker</div>
    <div class="px-4 pb-4 text-lg">
      {{currentTime}}
    </div>
  </div>
  <div class="flex flex-col gap-3">
    <nuxt-link class="btn-primary-green" to="/create">
      Record New Donation
    </nuxt-link>

    <div class="flex gap-2 items-center justify-center">
      <nuxt-link class="btn-primary" to="/export">
        Export Data
      </nuxt-link>
      <nuxt-link class="btn-primary" to="/top">
        Top Donators
      </nuxt-link>
      <nuxt-link class="btn-primary" to="/all">
        All Donators
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
import { saveAs } from 'file-saver';

definePageMeta({
  title: 'Donation Tracker'
})

function getTime() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;

  const formattedTime = hours + ':' + minutes + ' ' + ampm;
  return formattedTime;
}

const currentTime = ref(getTime())

if(process.client) {
  setInterval(() => {
    currentTime.value = getTime();
  }, 1000);
}
</script>
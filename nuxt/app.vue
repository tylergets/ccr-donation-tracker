<template>
  <Title>
    {{route.meta.title}}
  </Title>
  <div class="bg-black py-3 text-white mb-2 no-print">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between w-full">
        <div>
          <NuxtLink class="flex items-center gap-2" v-if="$route.path !== '/'" to="/">
            <Icon name="ic:outline-arrow-back"/>
            Return Home
          </NuxtLink>
        </div>
        <div>
          {{route.meta.title}}
        </div>
      </div>
    </div>
  </div>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <NuxtPage/>
  </div>
  <div class="flex flex-col text-xs mt-4 items-center justify-center gap-2 no-print">
    <div>
      <a class="text-blue-500 underline" href="https://github.com/tylergets/ccr-donation-tracker">View On Github</a>
    </div>
    <div>Contact <a class="text-blue-500 underline" href="mailto:tylergetsay@gmail.com">Tyler Getsay</a> for support</div>
  </div>
</template>

<style>

html, body {
  @apply bg-gray-300 min-h-screen;
}

/* Add this in your CSS file */
.btn-primary, .btn-primary-green {
  @apply flex items-center justify-center; /* Flexbox properties to center icon and text */
  @apply bg-blue-500 text-white font-bold py-2 px-4 rounded; /* Shared styles */
  @apply hover:bg-blue-700;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
}

.btn-primary {
  @apply bg-blue-500; /* Specific background color */
}

.btn-primary-green {
  @apply bg-green-500; /* Specific background color */
}

/* Optional: Adding space between icon and text */
.btn-primary > .icon, .btn-primary-green > .icon {
  @apply mr-2; /* Adds margin to the right of the icon */
}
.link {
  @apply text-blue-600 underline;
}

@media print
{
  .pagebreak { page-break-before: always; } /* page-break-after works, as well */

  .no-print, .no-print *
  {
    display: none !important;
  }
}

@media screen {
  .only-print {
    display: none;
  }
}

</style>

<script setup>
const route = useRoute();
const appConfig = useAppConfig();

useHead({
  title: 'Donation Tracker',
})
</script>
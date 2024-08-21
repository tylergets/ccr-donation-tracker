<script setup>
const downloading = ref(false);

async function exportDonations(formData) {
  downloading.value = 'Downloading';
  try {
    const {data} = await useFetch('/api/export', {
      method: 'POST',
      body: formData
    });
    const blob = new Blob([unref(data)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${Date.now()}_donations_export.csv`);
    downloading.value = 'Retry';
  } catch (e) {
    downloading.value = 'Error';
  }
}

definePageMeta({
  title: 'Export Data'
})

</script>

<template>
  <PasswordProtect>
    <div class="flex">
      <FormKit @submit="exportDonations" type="form">
        <FormKit type="datetime-local" label="Start" name="start"/>
        <FormKit type="datetime-local" label="End" name="end"/>
      </FormKit>
    </div>
  </PasswordProtect>
</template>

<style scoped>

</style>
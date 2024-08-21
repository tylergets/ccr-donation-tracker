<template>
  <div class="p-2 m-2 border">
    <div class="font-bold">Admin Controls</div>
    <button class="btn-primary" @click="seedDB">
      Seed DB
    </button>
  </div>

  <div>
    <div>Import Old Database</div>
    <FormKit type="form" @submit="processUpload">
      <FormKit name="files" type="file"/>
    </FormKit>
  </div>
</template>

<script setup>

async function processUpload({files}) {
  const formData = new FormData();

  formData.append('file', files[0].file);

  const {data, error} = await useFetch('/api/import', {
    method: 'POST',
    body: formData
  })

  if (error) {
    alert(unref(error));
  } else {
    alert('Finished');
  }

}

const seedDB = async () => {
  const resp = await fetch('/api/seed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  console.log(resp);
  debugger
}
</script>
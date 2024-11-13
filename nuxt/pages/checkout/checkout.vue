<template>
  <div v-if="message" class="font-bold text-red-500 py-2">
    {{ message }}
  </div>

  <!-- Display config data -->
  <div v-if="configData">
    <div>
      <p class="my-4 text-xl">
        {{configData.volunteerCheckoutText ?? "Volunteers who have accumulated at least 10 hours may sign out certain types of equipment at no charge. This form must be completed and approved by a board member before equipment is removed. No more than 3 items may be signed out during any one work session."}}
      </p>

      <p class="font-bold mb-4">
        Items that contain personal data from a donor MAY NOT be signed out unless the item is first
        wiped of data. This needs to be confirmed by a board member.
      </p>
    </div>

    <div>
      <FormKit type="form" @submit="submitForm" :actions="false">
        <FormKit type="text" name="name" label="Your Name" v-model="formData.name" required />
        <FormKit type="text" name="email" label="Your Email" v-model="formData.email" required />
        <p class="mb-4 text-base font-bold">Items To Be Checked Out</p>
        <div v-for="(item, index) in formData.items" :key="index" class="mb-2">
          <FormKit
              type="text"
              :name="`item_${index}_description`"
              :label="`Item Description ${index + 1}`"
              v-model="item.description"
              required
          />
        </div>

        <div class="flex gap-4 mt-4">
          <div>
            <FormKit type="button" @click="addItem" :disabled="formData.items.length >= 3">
              Add Item
            </FormKit>
          </div>
          <div>
            <FormKit type="submit">Submit</FormKit>
          </div>
        </div>
      </FormKit>
    </div>
  </div>
  <div v-else-if="configError">
    <p>Error loading config data: {{ configError.message }}</p>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useFetch, useAsyncData} from '#app';

const router = useRouter();

definePageMeta({
  title: 'Checkout Equipment',
});

const message = ref(null);

const formData = ref({
  name: '',
  items: [{description: ''}],
});

// Fetch config data before rendering the template
const {data: configData, error: configError} = await useAsyncData('configData', () => $fetch('/api/get_config'));

// Function to add a new item input
function addItem() {
  if (formData.value.items.length < 3) {
    formData.value.items.push({description: ''});
  }
}

// Function to submit the form
async function submitForm() {
  message.value = null;

  // Validate form data
  if (!formData.value.name) {
    message.value = 'Please enter your name.';
    return;
  }

  if (formData.value.items.length === 0) {
    message.value = 'Please add at least one item.';
    return;
  }

  // Prepare items object
  const items = {};
  formData.value.items.forEach((item) => {
    if (item.description) {
      items[item.description] = (items[item.description] || 0) + 1;
    }
  });

  if (Object.keys(items).length === 0) {
    message.value = 'Please provide descriptions for the items.';
    return;
  }

  // Prepare data to send to the API
  const dataToSend = {
    volunteerName: formData.value.name,
    volunteerEmail: formData.value.email,
    items,
  };

  // Send the data to the equipment checkout creation route
  const {data, error} = await useFetch('/api/create_equipment_checkout', {
    method: 'POST',
    body: dataToSend,
  });

  if (error.value) {
    message.value = error.value.message || 'An error occurred.';
    return;
  }

  if (data.value.status === 'success') {
    alert('Equipment checkout created successfully.');
    router.push('/')
  } else {
    message.value = data.value.message || 'An error occurred.';
  }
}
</script>

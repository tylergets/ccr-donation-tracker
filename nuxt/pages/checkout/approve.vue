<template>
  <PasswordProtect>
    <div v-if="message" class="font-bold text-red-500 py-2">
      {{ message }}
    </div>

    <FormKit v-model="approvedBy" type="text" label="Approved By" />


    <div v-if="data?.data?.length > 0">
      <table class="table w-full table-auto">
        <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">Name</th>
          <th class="text-left">Email</th>
          <th class="text-left">Items</th>
          <th class="text-right">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="i in data.data" :key="i.id">
          <td class="text-left">{{ i.id }}</td>
          <td class="text-left">{{ i.volunteer.name }}</td>
          <td class="text-left">{{ i.volunteer.email }}</td>
          <td class="text-left">{{ Object.keys(JSON.parse(i.items)).join(", ") }}</td>
          <td class="text-right">
            <button
                class="btn btn-green"
                @click="approve(i)"
                :disabled="!approvedBy"
            >
              Approve
            </button>
            <button
                class="btn btn-red ml-2"
                @click="deny(i)"
            >
              Deny
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      No pending checkouts
    </div>
  </PasswordProtect>
</template>

<script setup>
import { ref } from 'vue';
import { useFetch } from '#app';

definePageMeta({
  title: 'Pending Checkouts',
});

const approvedBy = ref('');
const message = ref('');
const { data, refresh } = await useFetch('/api/equipment_checkouts', {}); // Updated to fetch non-approved requests

async function approve(item) {
  try {
    const response = await $fetch('/api/update_equipment_checkouts', {
      method: 'POST',
      body: {
        requestId: item.id,
        approvedBy: approvedBy.value,
      },
    });
    message.value = 'Request approved successfully!';
    refresh(); // Refresh the data
  } catch (error) {
    message.value = `Error: ${error.message}`;
  }
}

async function deny(item) {
  try {
    const response = await $fetch('/api/update_equipment_checkouts', {
      method: 'POST',
      body: {
        requestId: item.id,
        denied: true,
      },
    });
    message.value = 'Request disapproved successfully!';
    refresh(); // Refresh the data
  } catch (error) {
    message.value = `Error: ${error.message}`;
  }
}
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-green {
  background-color: #38a169;
  color: white;
}

.btn-red {
  background-color: #e53e3e;
  color: white;
}

.btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}
</style>

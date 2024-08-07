<template>
  <PasswordProtect>


    <div v-if="message" class="font-bold text-red-500 py-2">
      {{message}}
    </div>

    <div v-if="data.length > 0">
      <table class="table w-full table-auto">
        <thead>
        <tr>
          <th class="text-left">First Name</th>
          <th class="text-left">Last Name</th>
          <th class="text-left">Phone</th>
          <th class="text-left">Email</th>
          <th class="text-left">Item Count</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in data">
          <td class="text-left">{{user.firstName}}</td>
          <td class="text-left">{{user.lastName}}</td>
          <td class="text-left">{{user.phone}}</td>
          <td class="text-left">{{user.email}}</td>
          <td class="text-left">{{user.totalCount}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      No donors found.
    </div>


  </PasswordProtect>
</template>

<script setup>

definePageMeta({
  title: 'Top Donors'
})

const message = ref();

const {data} = await useFetch('/api/top_donors', {})


</script>
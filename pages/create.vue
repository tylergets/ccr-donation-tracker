<template>

  <div v-if="message" class="font-bold text-red-500 py-2">
    {{message}}
  </div>

  <div v-if="createNew">

    <FormKit v-model="customerData" :actions="false" @submit="createNewDonor" type="form">
      <div class="mb-2 font-bold text-lg">Donor Information</div>

      <div class="flex gap-4">
        <FormKit type="text" autofocus ref="firstName" name="firstName" label="First Name" />
      <FormKit type="text" name="lastName" label="Last Name" />
      </div>
      <div class="flex gap-4">
        <FormKit type="email" placeholder="office@cincinnaticomputercooperative.org" name="email" label="Email Address" />
        <FormKit type="tel" placeholder="440-409-4081" name="phone" label="Phone Number" />
      </div>
      <div class="flex gap-4">
        <FormKit type="radio" name="isBusiness" :options="[{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }]" label="Is This A Business?" />
        <FormKit type="text" v-if="customerData.isBusiness" name="businessName" label="Business Name" />
      </div>

      <div class="mb-2 font-bold text-lg">Address Information</div>

      <div class="flex gap-4">
        <FormKit type="text" name="address" label="Address" />
        <FormKit type="text" name="city" label="City" />
      </div>
      <div class="flex gap-4">
        <FormKit type="text" name="state" label="State" />
        <FormKit type="text" name="zip" label="Zip Code" />
      </div>

      <FormKit type="submit" label="Create Donor" />
    </FormKit>
  </div>
  <div v-else>
    <div>
      <ol class="list-decimal list-inside py-2">
        <li>Enter A Donors Last Name, Email, or Phone</li>
        <li>Press "Lookup Donor"</li>
        <li>If previous donor is found, select them from the list below.</li>
        <li>If not, you will be prompted to fill out their information.</li>
      </ol>
    </div>
    <div class="flex justify-between items-center">

      <div class="flex-1">
        <FormKit :actions="false" v-model="customerData" @submit="findExisting" type="form">

          <div class="flex items-end gap-4">
            <FormKit type="text" autofocus name="lastName" label="Last Name"/>
            <FormKit type="email" name="email" label="Email"/>
            <FormKit type="tel" name="phone" label="Phone Number"/>

          </div>
            <div class="flex gap-2">
              <div>
                <button class="btn-primary" type="submit">
                  <Icon class="icon" name="fa-solid:search" />
                  Lookup Donor
                </button>
              </div>
              <div>
                <button class="btn-primary" @click="createNew = true">
                  <Icon class="icon" name="fa-solid:plus" />
                  Create New
                </button>
              </div>
            </div>

        </FormKit>
      </div>

    </div>
  </div>

  <div v-if="existingUsers.length > 0" class="mt-4">
    <table class="table w-full table-auto">
      <thead>
        <tr>
          <th class="text-left">First Name</th>
          <th class="text-left">Last Name</th>
          <th class="text-left">Phone</th>
          <th class="text-left">Email</th>
          <th class="text-right"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in existingUsers">
          <td class="text-left">{{user.firstName}}</td>
          <td class="text-left">{{user.lastName}}</td>
          <td class="text-left">{{user.phone}}</td>
          <td class="text-left">{{user.email}}</td>
          <td class="text-right">
            <NuxtLink class="link" :to="'/donor/' + user.id">
              Create Donation
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script setup>

definePageMeta({
  title: 'Lookup Donor'
})

const firstName = ref();

const createNew = ref(false);
const customerData = ref({
  city: 'Cincinnati',
  isIndividual: true,
  isBusiness: false,
  state: 'OH'
});
const existingUsers = ref([]);
const message = ref(null);

const router = useRouter();

async function createNewDonor(formData) {
  const {data, error} = await useFetch('/api/create_donor', {
    method: 'POST',
    body: formData,
  });

  formData.isIndividual = !formData.isBusiness;

  if(unref(error)) {
    message.value = unref(error);
  }

  if (unref(data).donor) {
    return router.push('/donor/' + unref(data).donor[0].id);
  }

  message.value = 'An unknown error occurred';

}

async function findExisting(data) {
  const result = await useFetch('/api/lookup', {
    method: 'POST',
    body: data,
  }).then((r) => r.data)

  if(!unref(result) || unref(result).length === 0) {
    createNew.value = true;
    message.value = "No donor found with that information, please fill in info below."
    nextTick(() => {
      console.log(firstName);
      debugger
    })
  } else {
    existingUsers.value = result.value;
  }
}

</script>
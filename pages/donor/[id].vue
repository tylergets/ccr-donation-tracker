<script setup lang="ts">
import { ref, computed } from 'vue';
const router = useRouter();
const route = useRoute();

const { data: receivables, pending } = await useFetch('/api/receivables')
const { data: donor } = await useFetch('/api/donor/' + route.params.id)

const errorResult: any = ref(null);


const receivedByLast = useLocalStorage('receivedByLast', '');

const donateData: any = ref({ items: {} });

const totalCount = computed(() => {
  return Object.values(donateData.value.items).reduce((pv, cv) => {
    let count = parseInt(cv as string);

    if (isNaN(count)) {
      return pv;
    }

    return pv + count;
  }, 0);
});

async function createDonation(body: any) {
  const { data, error } = await useFetch('/api/create_donation', {
    method: 'POST',
    body: {
      donorId: parseInt(body.donorId),
      itemCounts: body.items,
      totalCount: totalCount.value,
      dataDestruction: body.dataDestruction,
      notes: body.notes,
      email: body.email,
      receivedBy: body.receivedBy,
    },
  })

  if (unref(error)) {
    errorResult.value = unref(error);
  } else {
    router.push('/donation/' + data.value.donation.id);
  }

}

definePageMeta({
  title: 'Create Donation'
});

function add(name: string, amount: number = 1) {
  donateData.value.items[name] = (parseInt(donateData.value.items[name]) || 0) + amount;
}

function remove(name: string, amount: number = 1) {
  donateData.value.items[name] = (parseInt(donateData.value.items[name]) || 0) - amount;
}

const requestDestructionLetter = ref(false);

const donorEmail = computed(() => {
  if (donor.value) {
    return unref(donor).email
  }
  return "";
})
</script>


<template>

  <div v-if="errorResult">
    {{errorResult}}
  </div>

  <div v-if="donor">
    <div>
      {{donor.firstName}} {{donor.lastName}}
    </div>
    <div>
      {{donor.email ?? "No Email Address"}}
    </div>
  </div>

  <div v-if="!pending">
    <FormKit :actions="false" v-model="donateData" @submit="createDonation" type="form">

      <div class="flex gap-10">
        <div>
          <div class="font-bold text-xl py-4">Items Being Received</div>
          <FormKit type="group" name="items">
            <div v-for="receivable in receivables">
              <div class="flex items-center gap-2">
                <div class="btn-primary mt-1.5" @click="remove(receivable.name, 1)">
                  <Icon name="material-symbols:exposure-neg-1"/>
                </div>

                <FormKit placeholder="0" type="number" :label="receivable.name" :name="receivable.name"/>
                <div class="btn-primary mt-1.5" @click="add(receivable.name, 1)">
                  <Icon name="material-symbols:exposure-plus-1"/>
                </div>
                <div class="btn-primary mt-1.5" @click="add(receivable.name, 2)">
                  <Icon name="material-symbols:exposure-plus-2"/>
                </div>
              </div>
            </div>
          </FormKit>
        </div>
        <div>
          <div class="font-bold text-xl py-4">Receiver Information</div>

          <FormKit type="hidden" name="donorId" :value="route.params.id"/>


          <FormKit type="textarea" label="Notes" name="notes"/>
          <FormKit v-model="receivedByLast" type="text" label="Received By" name="receivedBy" validation="required"/>
          <FormKit v-model="totalCount" type="number" disabled label="Total Item Count" />

          <FormKit type="checkbox" v-model="requestDestructionLetter" name="dataDestruction" label="Request Destruction Letter" />
          <FormKit type="email" :required="requestDestructionLetter" v-model="donorEmail" name="email" label="Donor Email" />

          <FormKit type="submit"/>
        </div>
      </div>



    </FormKit>
  </div>
  <div v-else>
    Loading
  </div>

  <div v-if="!pending && receivables.length === 0">
    <NuxtLink to="/admin">
      No receivables are defined, navigate to the /admin page to setup the application.
    </NuxtLink>
  </div>
</template>

<style scoped>

</style>
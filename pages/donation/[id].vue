<script setup>
const router = useRouter();
const route = useRoute();

const {data: donation, pending} = await useFetch('/api/donation/' + route.params.id)

definePageMeta({
  title: 'View Donation'
});

if (process.client) {
  setTimeout(() => {
    window.print();
  }, 500);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  // Then specify how you want your dates to be formatted
  return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
}
</script>


<template>
  <div v-if="!pending">
    <div ><h1 class="text-xl font-bold mb-4">Donation Receipt</h1>

      <div class="mb-4" v-if="donation.dataDestruction === 1">
        <div class="text-2xl underline font-bold">A Data Destruction Letter Has Been Requested</div>
      </div>

      <div>
        <div>Donation #{{ donation.id }}</div>
        <div>Received By {{ donation.receivedBy }}</div>
        <div>Received On {{ formatDate(donation.createdAt) }}</div>
        <div>Received For {{ donation.donor.firstName }} {{ donation.donor.lastName }} ({{ donation.donor.email }})
        </div>
      </div>


      <div class="mt-2">
        <div v-for="(count, type) in donation.itemCounts">
          {{ type }} - {{ count }}
        </div>
      </div>

      <div class="mt-2">
        Thank you for your donation to Cincinnati Computer Reuse!
      </div>
    </div>
    <div v-if="donation.dataDestruction" class="only-print pagebreak">
      <h1 class="text-xl font-bold mb-4">Donation Receipt</h1>

      <div class="mb-4" v-if="donation.dataDestruction === 1">
        <div class="text-2xl underline font-bold">A Data Destruction Letter Has Been Requested</div>
      </div>

      <div>
        <div>Donation #{{ donation.id }}</div>
        <div>Received By {{ donation.receivedBy }}</div>
        <div>Received On {{ formatDate(donation.createdAt) }}</div>
        <div>Received For {{ donation.donor.firstName }} {{ donation.donor.lastName }} ({{ donation.donor.email }})
        </div>
      </div>


      <div class="mt-2">
        <div v-for="(count, type) in donation.itemCounts">
          {{ type }} - {{ count }}
        </div>
      </div>

      <div class="mt-2">
        Thank you for your donation to Cincinnati Computer Reuse!
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
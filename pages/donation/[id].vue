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

const thankYouText = [
  `Thanks for thinking of Cincinnati Computer Reuse when disposing of unneeded tech items. Every computer donated to our nonprofit has value. Working desktops and laptops can be re-imaged with licensed software and prepared for a new home. Broken or obsolete items can be deconstructed and the materials sold as scrap. Scrap sales fund approximately 30% of our operating costs.`,
  `Our goal is to make access to technology affordable for everyone. Your donation helps further our mission.`
];

const dataLetterText = `A Data Destruction Letter Will Be Emailed To You.`;
</script>


<template>
  <div v-if="!pending">
    <div ><h1 class="text-xl font-bold mb-4">Donation Receipt</h1>

      <div class="mb-4" v-if="donation.dataDestruction === 1">
        <div class="text-2xl underline font-bold">{{dataLetterText}}</div>
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
        <div class="mt-2 flex-col flex gap-4">
          <div v-for="text in thankYouText">
            {{text}}
          </div>
        </div>
      </div>
    </div>
    <div v-if="donation.dataDestruction" class="only-print pagebreak">
      <h1 class="text-xl font-bold mb-4">Destruction Receipt</h1>

      <div class="mb-4" >
        <div class="text-2xl underline font-bold">{{dataLetterText}}</div>
      </div>

      <div class="mb-4" >
        <div class="text-2xl underline font-bold border-2 py-6 px-4">
          Please Keep This Print-Out With The Donated Items!
        </div>
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

    </div>
  </div>
</template>

<style scoped>

</style>
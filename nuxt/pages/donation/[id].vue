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
];

if(process.client) {
  setTimeout(() => {
    router.push('/create');
  }, 5000);
}


</script>


<template>
  <div v-if="!pending">
    <div ><h1 class="text-xl font-bold mb-4">Donation Receipt</h1>

      <div class="mb-4" v-if="donation.dataDestruction === 1">
        <div class="border p-4 font-bold flex flex-col gap-2">
          <div class="text-xl">Data Destruction Letter Requested</div>
          <div>The Data Destruction Letter Will Be Emailed To You At {{donation.donor.email}}</div>
        </div>
      </div>


      <div class="flex justify-between">
        <div class="flex-1">
          <img src="~/assets/logo.png"/>
        </div>
        <div class="flex-1">
          <div class="text-lg">
            <div>Donation #{{ donation.id }}</div>
            <div>Received On {{ formatDate(donation.createdAt) }}</div>
            <div>Received For {{ donation.donor.firstName }} {{ donation.donor.lastName }} ({{ donation.donor.email }})
            </div>
          </div>
        </div>
      </div>


      <div class="mt-2 text-lg">
        <div v-for="(count, type) in donation.itemCounts">
          {{ type }} - {{ count }}
        </div>
      </div>


      <div v-if="donation.centsReceived" class="mt-4 text-lg">
        Amount Received - ${{donation.centsReceived}}
      </div>

      <div v-if="donation.centsReceived" class="mt-4 text-sm">
        No goods or services were provided by Cincinnati Computer Reuse in return for this contribution.
        Impact 100 is a tax exempt organization as described in Section 501(c)3 of the IRS Code – EIN #73-1645747
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

      <div class="mb-4" v-if="donation.dataDestruction === 1">
        <div class="border p-4 font-bold flex flex-col gap-2">
          <div class="text-xl">Data Destruction Letter Requested</div>
          <div>Please Keep This Print-Out With The Donated Items!</div>
          <div>The Data Destruction Letter Should Be Emailed To {{donation.donor.email}}</div>
        </div>
      </div>

      <div>
        <div>Donation #{{ donation.id }}</div>
        <div>Received By {{ donation.receivedBy }}</div>
        <div>Received On {{ formatDate(donation.createdAt) }}</div>
        <div>Received For {{ donation.donor.firstName }} {{ donation.donor.lastName }} ({{ donation.donor.email }})
        </div>
      </div>

      <div v-if="donation.notes" class="mt-4 text-xl border p-4">
        {{donation.notes}}
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
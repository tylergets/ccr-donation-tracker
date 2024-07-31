<template>

  <div v-if="message" class="font-bold text-red-500 py-2">
    {{message}}
  </div>

  <div v-if="pending">
    Loading... please wait
  </div>
  <div v-else>
    <div class="mb-2">Data loaded: {{data.length}}</div>
    <div class="h-[500px]">
      <AgGridVue
          :gridOptions="gridOptions"
          :rowData="data"
          style="height: 900px"
          class="ag-theme-quartz"
      />
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component

definePageMeta({
  title: 'All Donations'
})

const message = ref();

const {data, pending} = await useFetch('/api/all_donations', {})

const gridOptions = {
  defaultColDef: {
    flex: 1,
    sortable: true,
  },
  columnDefs: [
    {field: 'donor.firstName'},
    {field: 'donor.lastName'},
    {field: 'donor.email'},
    {field: 'donor.phone'},
    {field: 'donor.isIndividual', headerName: 'Is Individual', valueGetter: ({value}) => value === 1 },
    {field: 'donor.isBusiness', headerName: 'Is Business', valueGetter: ({value}) => value === 1 },
    {field: 'itemCounts.Desktops', headerName: 'Desktops'},
    {field: 'itemCounts.Laptops', headerName: 'Laptops'},
    {field: 'itemCounts.Servers', headerName: 'Servers'},
    {field: 'totalCount'},
  ]
};

</script>
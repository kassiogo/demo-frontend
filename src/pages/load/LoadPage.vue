<template>
  <q-page padding>
    <q-breadcrumbs class="q-pb-lg">
      <q-breadcrumbs-el label="Home" />
      <q-breadcrumbs-el label="Dashboard" />
    </q-breadcrumbs>

    <div class="row q-pb-lg q-col-gutter-md" v-if="countries.length == 0">
      <div class="col-md-1 col-lg-4">
        <q-btn
          :disabled="loadindDataFromJsonFile"
          color="primary"
          icon="battery_charging_full"
          label="Load Data Countries | States | Cities"
          @click="loadDataFromJsonFile"
        >
          <q-tooltip class="bg-accent">
            Load data of countries, states and cities from a local json file
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-md-1 col-lg-4">
        <span class="text-h6">Countries</span>
        <q-table
          hide-header
          :rows="countries"
          :columns="columnsCountries"
          row-key="id"
          :filter="filterCountry"
        >
          <template v-slot:top-right>
            <q-input
              dense
              debounce="300"
              v-model="filterCountry"
              placeholder="Filter"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="actions" :props="props">
                <q-btn flat round icon="delete_forever">
                  <q-tooltip class="bg-accent"> Delete country </q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  round
                  icon="arrow_circle_right"
                  @click="statesFindByCountry(props.row.id, props.row)"
                >
                  <q-tooltip class="bg-accent">
                    List states of this country
                  </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="col-md-1 col-lg-4" v-if="states.length > 0">
        <span class="text-h6">States of {{ countryRowSelected }}</span>
        <q-table
          hide-header
          :rows="states"
          :columns="columnsCountries"
          row-key="id"
          :filter="filterState"
        >
          <template v-slot:top-right>
            <q-input
              dense
              debounce="300"
              v-model="filterState"
              placeholder="Filter"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="actions" :props="props">
                <q-btn flat round icon="delete_forever">
                  <q-tooltip class="bg-accent"> Delete state </q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  round
                  icon="arrow_circle_right"
                  @click="citiesFindByState(props.row.id, props.row)"
                >
                  <q-tooltip class="bg-accent">
                    List cities of this state
                  </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="col-md-1 col-lg-4" v-if="cities.length > 0">
        <span class="text-h6">Cities of {{ stateRowSelected }}</span>
        <q-table
          hide-header
          :rows="cities"
          :columns="columnsCountries"
          row-key="id"
          :filter="filterCity"
        >
          <template v-slot:top-right>
            <q-input
              dense
              debounce="300"
              v-model="filterCity"
              placeholder="Filter"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="actions" :props="props">
                <q-btn
                  flat
                  round
                  icon="delete_forever"
                  @click="citiesDelete(props.row.id, props.row.state.id)"
                >
                  <q-tooltip class="bg-accent"> Delete city </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, inject } from "vue";

const beServices = inject("beApiServices");
const filterCountry = ref("");
const filterState = ref("");
const filterCity = ref("");
const countries = ref([]);
const states = ref([]);
const cities = ref([]);
const countryRowSelected = ref("");
const stateRowSelected = ref("");
const loadindDataFromJsonFile = ref(false);

const columnsCountries = [
  {
    name: "name",
    label: "Country",
    align: "left",
    field: (row) => row.name,
    sortable: true,
  },
  {
    name: "actions",
    label: "Actions",
    align: "right",
    field: "",
  },
];

function loadDataFromJsonFile() {
  loadindDataFromJsonFile.value = true;
  beServices.saveFromJsonFile().then((resp) => {
    countries.value = resp;
  });
}

function countriesFindAll() {
  beServices.countriesFindAll().then((resp) => {
    countries.value = resp;
  });
}

function statesFindByCountry(countryId, row) {
  countryRowSelected.value = row.name;
  cities.value = [];
  states.value = [];
  beServices.countriesFindStates(countryId).then((resp) => {
    states.value = resp;
  });
}

function citiesFindByState(stateId, row) {
  if (row !== null) {
    stateRowSelected.value = row.name;
  }

  cities.value = [];
  beServices.statesFindSCities(stateId).then((resp) => {
    cities.value = resp;
  });
}

function citiesDelete(cityId, stateId) {
  beServices.citiesDelete(cityId).then(() => {
    citiesFindByState(stateId, null);
  });
}

countriesFindAll();
</script>

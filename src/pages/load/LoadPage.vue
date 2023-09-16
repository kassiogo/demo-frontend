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
          <q-tooltip class="bg-primary">
            Load data of countries, states and cities from a local json file
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-xs-12 col-lg-4">
        <span class="text-h6">Countries</span>
        <q-table
          hide-header
          :rows="countries"
          :columns="columns"
          row-key="id"
          :filter="filterCountry"
        >
          <template v-slot:top-right>
            <q-input
              dense
              clearable
              autofocus
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
                <q-btn
                  flat
                  round
                  icon="delete_forever"
                  @click="countriesDelete(props.row.code)"
                >
                  <q-tooltip class="bg-primary gt-lg">
                    Delete country
                  </q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  round
                  icon="arrow_circle_right"
                  @click="statesFindByCountry(props.row.id, props.row)"
                >
                  <q-tooltip class="bg-primary gt-lg">
                    List states of this country
                  </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="col-xs-12 col-lg-4" v-if="states.length > 0">
        <span class="text-h6">States of {{ countrySelectedName }}</span>
        <q-table
          hide-header
          :rows="states"
          :columns="columns"
          row-key="id"
          :filter="filterState"
        >
          <template v-slot:top-right>
            <q-input
              dense
              clearable
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
                <q-btn
                  flat
                  round
                  icon="delete_forever"
                  @click="statesDelete(props.row.id, props.row.country.id)"
                >
                  <q-tooltip class="bg-primary gt-lg"> Delete state </q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  round
                  icon="arrow_circle_right"
                  @click="citiesFindByState(props.row.id, props.row)"
                >
                  <q-tooltip class="bg-primary gt-lg">
                    List cities of this state
                  </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="col-xs-12 col-lg-4" v-if="cities.length > 0">
        <span class="text-h6">Cities of {{ stateSelectedName }}</span>
        <q-table
          hide-header
          :rows="cities"
          :columns="columns"
          row-key="id"
          :filter="filterCity"
        >
          <template v-slot:top-right>
            <q-input
              dense
              clearable
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
                  <q-tooltip class="bg-primary gt-lg"> Delete city </q-tooltip>
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
import { useQuasar } from "quasar";
const $q = useQuasar();

const beServices = inject("beApiServices"); // Service object used to access the backend API.
const filterCountry = ref(""); // String variable used to implement a filter in the country table.
const filterState = ref(""); // String variable used to implement a filter in the state table.
const filterCity = ref(""); // String variable used to implement a filter in the city table.
const countries = ref([]); // The array list object that represents the countries (JSON object served by backend API).
const states = ref([]); // the array list object that represents the states (JSON object served by backend API).
const cities = ref([]); // The array list object that represents the cities (JSON object served by backend API).
const countrySelectedName = ref(""); // The variable used to store the name of the selected country.
const stateSelectedName = ref(""); // The variable used to store the name of the selected state.
const loadindDataFromJsonFile = ref(false); // The variable used to control whether the initial data was loaded.

// Columns of tables Country, State and Cities (all of the tables on the page use the same object "columns".
const columns = [
  {
    name: "name",
    label: "",
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

/**
 * A function used for the initial data load of countries, states, and cities.
 */
function loadDataFromJsonFile() {
  loadindDataFromJsonFile.value = true;
  beServices.saveFromJsonFile().then((resp) => {
    countries.value = resp;
  });
}

/**
 * A function that gets all countries.
 */
function countriesFindAll() {
  beServices.countriesFindAll().then((resp) => {
    countries.value = resp;
  });
}

/**
 * A function that gets all states of a country.
 */
function statesFindByCountry(countryId, countryObject) {
  if (countryObject !== null) {
    countrySelectedName.value = countryObject.name;
  }

  cities.value = [];
  states.value = [];
  beServices.countriesFindStates(countryId).then((resp) => {
    states.value = resp;
  });
}

/**
 * A function that gets all cities of a state.
 */
function citiesFindByState(stateId, cityObject) {
  if (cityObject !== null) {
    stateSelectedName.value = cityObject.name;
  }

  cities.value = [];
  beServices.statesFindSCities(stateId).then((resp) => {
    cities.value = resp;
  });
}

/**
 * A function that deletes a city by id.
 */
function citiesDelete(cityId, stateId) {
  beServices.citiesDelete(cityId).then(() => {
    showNotify("City deleted!");
    citiesFindByState(stateId, null);
  });
}

/**
 * A function that deletes a state by id.
 */
function statesDelete(stateId, countryId) {
  beServices
    .statesDelete(stateId)
    .then(() => {
      showNotify("State deleted!");
      statesFindByCountry(countryId, null);
    })
    .catch((error) => {
      showDilogError(error);
    });
}

/**
 * A function that deletes a country by uuid code.
 */
function countriesDelete(countryUuidCode) {
  beServices
    .countriesDelete(countryUuidCode)
    .then(() => {
      countriesFindAll();
    })
    .catch((error) => {
      showDilogError(error);
    });
}

function showNotify(message) {
  $q.notify({ message, position: "center", type: "positive", timeout: 100 });
}

function showDilogError(error) {
  const title = "<span class='text-negative'>Error!</span>";
  const message = error.message;
  const html = true;
  $q.dialog({ title, message, html });
}

countriesFindAll();
</script>

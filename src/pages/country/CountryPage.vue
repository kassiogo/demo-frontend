<template>
  <q-page padding>
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Home" />
      <q-breadcrumbs-el label="Country" />
    </q-breadcrumbs>

    <div class="row q-pt-lg">
      <div class="col-6">
        <q-select
          filled
          v-model="model"
          clearable
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          label="Country name"
          :options="countries"
          @filter="filterFnAutoselect"
          @filter-abort="abortFilterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const stringOptions = ["Google", "Facebook", "Twitter", "Apple", "Oracle"];
const countries = ref(null);
const model = ref(null);

function filterFn(val, update, abort) {
  if (countries.value !== null) {
    // already loaded
    update();
    return;
  }

  setTimeout(() => {
    update(() => {
      countries.value = stringOptions;
    });
  }, 2000);
}

function filterFnAutoselect(val, update, abort) {
  // call abort() at any time if you can't retrieve data somehow

  setTimeout(() => {
    update(
      () => {
        if (val === "") {
          countries.value = stringOptions;
        } else {
          const needle = val.toLowerCase();
          countries.value = stringOptions.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        }
      },

      // "ref" is the Vue reference to the QSelect
      (ref) => {
        if (
          val !== "" &&
          ref.countries.length > 0 &&
          ref.getOptionIndex() === -1
        ) {
          ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
          ref.toggleOption(ref.countries[ref.optionIndex], true); // toggle the focused option
        }
      }
    );
  }, 300);
}

function abortFilterFn() {
  // console.log('delayed filter aborted')
}
</script>

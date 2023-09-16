<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Demo-Frontend App </q-toolbar-title>

        <div>
          <q-toggle v-model="darkMode" color="secondary" label="Dark page" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const darkMode = ref($q.dark.isActive);

const linksList = [
  {
    title: "Dashboard",
    caption: "A panel with data load for tests",
    icon: "dashboard",
    route: "/dashboard",
    routeName: "dashboard",
  },
  {
    title: "Countries",
    caption: "Registration and configuration",
    icon: "flag_circle",
    route: "/countries",
    routeName: "countries",
  },
];

const leftDrawerOpen = ref(false);
const essentialLinks = linksList;

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

watch(darkMode, (newValue) => {
  $q.dark.set(newValue);
});
</script>

<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->
    <q-page-container>
      <!-- <div class="q-pa-md">
        <div class="authentication-container">
          <logo />
        </div>
      </div> -->
      <!-- This is where pages get injected -->
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, defineAsyncComponent, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { LocalStorage } from "quasar";
const store = useAuthStore();
const user = computed(() => {
  return store.getUser;
});
const logo = defineAsyncComponent(() => import("../components/vha-logo.vue"));

const profileText = computed(() => {
  if (user.value) {
    const name = user.value.name?.split(" ");
    return `${name[0].charAt(0)}${name[1] ? name[1]?.charAt(0) : ""}`;
  } else {
    return "";
  }
});
// alert("sa");
// import EssentialLink from "components/EssentialLink.vue";
// import Sidebar from "src/layouts/MainSidebar.vue";

// const linksList = [
//   {
//     title: "Home",
//     icon: "home",
//     link: "#",
//   },
//   {
//     title: "User access control",
//     icon: "las la-user",
//     link: "#",
//   },
// ];
const router = useRouter();
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function changePassword() {
  router.push({ name: "change-password" });
}
function changeTwoFactor() {
  // LocalStorage.set("isTwoFactor", false);
  router.push({ name: "change-two-factor-security" });
}
function logout() {
  router.push({ name: "sign-in" });
  store.logout();
}
</script>

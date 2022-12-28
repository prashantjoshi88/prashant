<template>
  <LockScreen v-if="store.openPopup" :timer="count" />
  <router-view />
</template>

<script setup>
import { ref, defineAsyncComponent } from "vue";
import { useAuthStore } from "src/stores/auth";
import { LocalStorage } from "quasar";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();

const LockScreen = defineAsyncComponent(() =>
  import("./components/lock-screen.vue")
);
const store = useAuthStore();

const isIdle = ref(false);
const totalTimer = ref(process.env.DISPLAY_LOCK_TIMER);
const count = ref(process.env.DISPLAY_LOCK_TIMER);

var timer = setInterval(function () {
  if (
    route.name == "two-factor-verification" ||
    route.name == "sign-in" ||
    route.name == "two-factor-authentication-setup"
  ) {
    LocalStorage.set("LockScreen", false);
    store.openPopup = false;
  } else {
    if (store.isLoggedIn) {
      // if user logged in
      count.value--;
      store.lockCount = count.value;
      if (count.value < 0) {
        clearInterval(timer);
        store.openPopup = true;
        LocalStorage.set("LockScreen", store.openPopup);
        if (store.openPopup) {
          isIdle.value = true;
        }
        // isIdle.value = true;
      }
    }
  }
}, 1000);

addEventListener("click", function () {
  count.value = totalTimer.value;
});
addEventListener("keyup", function () {
  count.value = totalTimer.value;
});
addEventListener("mousemove", function () {
  count.value = totalTimer.value;
});
addEventListener("wheel", function () {
  count.value = totalTimer.value;
});
</script>

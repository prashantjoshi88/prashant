<template>
  <q-form @submit.prevent="onSubmit()">
    <Header
      :title="$q.lang.authentication.signIn.title"
      :subTitle="$q.lang.authentication.signIn.subtitle1"
    />

    <div class="q-pa-md login_form">
      <div class="authentication-container">
        <logo />
        <!-- <div class="responsive-box"> -->
        <div class="responsive-alighn">
          <div class="align-center-box">
            <div class="user_account_header">
              <h3 class="title">
                {{ $q.lang.authentication.signIn.title }}
              </h3>
            </div>
            <div class="q-mb-md">
              <label class="lable-text">Email</label>
              <q-input
                outlined
                hide-bottom-space
                v-model="email"
                :placeholder="$q.lang.authentication.signIn.email.placeHolder"
                :dense="dense"
                icon="las la-user"
                :rules="[
                  (val) => required(val, 'email'),
                  (val) => isEmail(val),
                ]"
                :error="errors['email'] ? true : false"
                :error-message="serverValidationError(errors, 'email')"
              >
                <template v-slot:append>
                  <q-icon name="las la-user geet-icon" />
                </template>
              </q-input>
            </div>
            <div class="q-mb-md">
              <label class="lable-text">Password</label>
              <q-input
                outlined
                hide-bottom-space
                v-model="password"
                :placeholder="
                  $q.lang.authentication.signIn.password.placeHolder
                "
                :dense="dense"
                :type="isPwd ? 'password' : 'text'"
                :rules="[(val) => required(val, 'password')]"
                :error="errors['password'] ? true : false"
                :error-message="serverValidationError(errors, 'password')"
              >
                <template v-slot:append>
                  <div>
                    <q-icon
                      class="geet-icon"
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      @click="isPwd = !isPwd"
                    />
                  </div>
                </template>
              </q-input>
            </div>
            <div class="text-left">
              <div class="q-mb-md">
                <q-checkbox v-model="val" @click="rememberMe(val)" />
                <b class="text-dark">{{
                  $q.lang.authentication.signIn.forgotPassword
                }}</b>
              </div>
            </div>
            <q-btn
              color="primary"
              :label="$q.lang.authentication.signIn.btn1"
              type="submit"
              class="social_login_btn"
            />
            <div class="q-pb-md text-center login-sec-txt"></div>
            <div class="text-center">
              <p class="login-bottom-text">
                <!-- <router-link :to="{ name: 'forgot-password' }">{{
                  $q.lang.authentication.signIn.subtitle4
                }}</router-link> -->
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </q-form>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";

import useServerError from "src/composables/useServerError";
import { useAuthStore } from "src/stores/auth";
import { useRouter } from "vue-router";
import { LocalStorage, Loading, QSpinnerGears } from "quasar";

const logo = defineAsyncComponent(() =>
  import("../../components/vha-logo.vue")
);

const { errors, serverValidationError } = useServerError();
const isPwd = ref(true);
const val = ref(true);
const email = ref("");
const password = ref("");
const store = useAuthStore();
const router = useRouter();

function rememberMe(val) {
  console.log(val);
}

function onSubmit() {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  LocalStorage.set("email", email.value);
  var data = {
    email: email.value,
    password: password.value,
  };
  store
    .signIn(data)
    .then((res) => {
      if (res.success) {
        if (res.twoFa == 0) {
          LocalStorage.set("isTwoFactor", false);
          router.push({ name: "two-factor-authentication-setup" });
          Loading.hide();
        } else {
          LocalStorage.set("isTwoFactor", true);
          LocalStorage.set("confirmTwoFactor", false);
          router.push({ name: "two-factor-verification" });
          Loading.hide();
        }
      }
    })
    .finally(() => {
      Loading.hide();
    });
}
</script>

<style lang="scss">
@import "src/css/auth.scss";
// $
</style>

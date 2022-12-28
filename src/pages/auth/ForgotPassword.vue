<template>
  <q-form @submit.prevent="onSubmit()">
    <div class="q-pa-md login_form">
      <div class="forgote-page-header">
        <div class="authentication-container">
          <logo />
          <div class="align-center-box">
            <div class="user_account_header">
              <h3 class="title">
                {{ $q.lang.authentication.forgotPassword.title }}
              </h3>
            </div>
            <div class="user_account_body">
              <div class="q-mb-md">
                <label class="lable-text">{{
                  $q.lang.authentication.forgotPassword.email.label
                }}</label>
                <q-input
                  outlined
                  hide-bottom-space
                  v-model="data.current_password"
                  :placeholder="
                    $q.lang.authentication.forgotPassword.email.placeHolder
                  "
                  :dense="dense"
                  debounce="500"
                  :rules="[
                    (val) => required(val, 'Email'),
                    (val) => isEmail(val),
                  ]"
                  :error="errors['email'] ? true : false"
                  :error-message="serverValidationError(errors, 'email')"
                >
                </q-input>
              </div>

              <div class="row btn-conform">
                <div class="col-md-6">
                  <q-btn
                    color="primary"
                    type="submit"
                    :label="$q.lang.authentication.forgotPassword.submit"
                    class="social_login_btn chnage-password"
                  />
                </div>

                <div class="col-md-6">
                  <q-btn
                    outline
                    :to="{ name: 'sign-in' }"
                    style="color: #55267c"
                    :label="$q.lang.authentication.changePassword.btn1"
                    class="social_login_btn chnage-password cancle"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-form>
</template>
<script setup>
import useServerError from "src/composables/useServerError";
import { defineAsyncComponent, ref } from "vue";
import { useAuthStore } from "src/stores/auth";
import notification from "src/boot/notification";

import { useRoute, useRouter } from "vue-router";

const logo = defineAsyncComponent(() =>
  import("../../components/vha-logo.vue")
);

const isPwd = ref(true);
const isPwd1 = ref(true);
const isPwd2 = ref(true);
const router = useRouter();

const store = useAuthStore();

const { errors, serverValidationError } = useServerError();

const data = ref({
  current_password: "",
  password: "",
  password_confirmation: "",
});

function validateConfirmPassword() {
  if (data.value.password !== data.value.password_confirmation) {
    return "Please Type Same Password";
  }
}

function onSubmit() {
  router.push({ name: "enter-otp" });
}
</script>

<style lang="scss">
@import "src/css/auth.scss";
@import "src/css/responsive.scss";
//$
</style>

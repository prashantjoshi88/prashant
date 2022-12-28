<template>
  <q-form @submit.prevent="onSubmit()">
    <div class="q-pa-md login_form">
      <div class="forgote-page-header">
        <div class="authentication-container">
          <logo />

          <div class="align-center-box">
            <div class="user_account_header">
              <h3 class="title">
                {{ $q.lang.authentication.resetPassword.title }}
              </h3>
              <p class="small_title">
                {{ $q.lang.authentication.resetPassword.subtitle }}
              </p>
            </div>
            <div class="user_account_body">
              <!-- <div class="q-mb-md"> -->
              <label class="lable-text">New password</label>
              <q-input
                outlined
                v-model="data.password"
                :placeholder="
                  $q.lang.authentication.resetPassword.password.placeHolder
                "
                :dense="dense"
                debounce="500"
                :type="isPwd ? 'password' : 'text'"
                :rules="[
                  (val) => required(val, 'password'),
                  (val) => validatePassword(val),
                  (val) => min(val, 8, 'password'),
                ]"
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

            <!-- <div class="q-mb-md"> -->
            <label class="lable-text">Confirm password</label>
            <q-input
              outlined
              v-model="data.password_confirmation"
              :placeholder="
                $q.lang.authentication.resetPassword.confirm_password
                  .placeHolder
              "
              :type="isPwd1 ? 'password' : 'text'"
              :dense="dense"
              debounce="500"
              :rules="[
                (val) => required(val, 'confirm password'),
                (val) => validateConfirmPassword(val),
                (val) => min(val, 8, 'confirm password'),
              ]"
              :error="errors['data.password_confirmation'] ? true : false"
              :error-message="
                serverValidationError(errors, 'data.password_confirmation')
              "
            >
              <template v-slot:append>
                <div>
                  <q-icon
                    class="geet-icon"
                    :name="isPwd1 ? 'visibility_off' : 'visibility'"
                    @click="isPwd1 = !isPwd1"
                  />
                </div>
              </template>
            </q-input>
            <div>
              <q-btn
                color="primary"
                type="submit"
                :label="$q.lang.authentication.resetPassword.btn"
                class="social_login_btn"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->
    <!-- </div> -->
  </q-form>
</template>
<script setup>
import useServerError from "src/composables/useServerError";
import { defineAsyncComponent, ref } from "vue";
const { errors, serverValidationError } = useServerError();
const isPwd = ref(true);
const isPwd1 = ref(true);
const logo = defineAsyncComponent(() =>
  import("../../components/vha-logo.vue")
);

const data = ref({
  password: "",
  password_confirmation: "",
});

function validateConfirmPassword() {
  if (data.value.password !== data.value.password_confirmation) {
    return "Please Type Same Password";
  }
}
</script>
<!--
<script setup>
import { ref } from "vue";
import { useAuthStore } from "src/stores/auth";
import notification from "src/boot/notification";
import { useRoute, useRouter } from "vue-router";
import { QSpinnerHourglass, useQuasar } from "quasar";
import { Loading } from "quasar";
import useServerError from "src/composables/useServerError";

const { errors, serverValidationError } = useServerError();
const store = useAuthStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const isPwd = ref(true);
const isPwd1 = ref(true);
const data = ref({
  email: route.params.email,
  password: "",
  password_confirmation: "",
});

function validatecpassword() {
  if (data.value.password !== data.value.password_confirmation) {
    return "Please Type Same Password";
  }
}

function onSubmit() {
  Loading.show({
    spinner: QSpinnerHourglass,
    message: "Loading...",
  });
  store
    .updatePassword(data.value)
    .then((res) => {
      notification.success(res.message);
      Loading.hide();
      router.push({
        name: "sign-in",
      });
    })
    .catch((err) => {
      Loading.hide();
      if (err.response) {
        errors.value = err.response.data.errors;
      }
    });
}
</script> -->

<style lang="scss">
@import "src/css/auth.scss";
@import "src/css/responsive.scss";
//$
</style>

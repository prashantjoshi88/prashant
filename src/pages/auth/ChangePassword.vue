<template>
  <q-form @submit.prevent="onSubmit()">
    <div class="q-pa-md login_form">
      <div class="forgote-page-header">
        <div class="authentication-container">
          <div class="align-center-box">
            <div class="user_account_header">
              <h3 class="title">
                {{ $q.lang.authentication.changePassword.title }}
              </h3>
            </div>
            <div class="user_account_body">
              <div class="q-mb-md">
                <label class="lable-text">Current password</label>
                <q-input
                  outlined
                  hide-bottom-space
                  v-model="data.current_password"
                  :placeholder="
                    $q.lang.authentication.changePassword.current_Password
                      .placeHolder
                  "
                  :dense="dense"
                  debounce="500"
                  :type="isPwd2 ? 'password' : 'text'"
                  :rules="[
                    (val) => required(val, 'Current Password'),
                    (val) => validatePassword(val),
                    (val) => min(val, 6, 'password'),
                  ]"
                  :error="errors['current_password'] ? true : false"
                  :error-message="
                    serverValidationError(errors, 'current_password')
                  "
                >
                  <template v-slot:append>
                    <div>
                      <q-icon
                        class="geet-icon"
                        :name="isPwd2 ? 'visibility_off' : 'visibility'"
                        @click="isPwd2 = !isPwd2"
                      />
                    </div>
                  </template>
                </q-input>
              </div>

              <div class="q-mb-md">
                <label class="lable-text">Create new password</label>
                <q-input
                  outlined
                  hide-bottom-space
                  v-model="data.password"
                  :placeholder="
                    $q.lang.authentication.changePassword.password.placeHolder
                  "
                  :dense="dense"
                  debounce="500"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[
                    (val) => required(val, 'password'),
                    (val) => validatePassword(val),
                    (val) => min(val, 6, 'password'),
                  ]"
                  :error="errors['data.password'] ? true : false"
                  :error-message="
                    serverValidationError(errors, 'data.password')
                  "
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
                <p class="small_title">
                  {{ $q.lang.authentication.changePassword.subtitle }}
                </p>
              </div>

              <div class="q-mb-md">
                <label class="lable-text">Confirm new password</label>
                <q-input
                  outlined
                  hide-bottom-space
                  v-model="data.password_confirmation"
                  :placeholder="
                    $q.lang.authentication.changePassword.confirm_password
                      .placeHolder
                  "
                  :type="isPwd1 ? 'password' : 'text'"
                  :dense="dense"
                  debounce="500"
                  :rules="[
                    (val) => required(val, 'confirm password'),
                    (val) => validateConfirmPassword(val),
                    (val) => min(val, 6, 'confirm password'),
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
              </div>
              <div class="row btn-conform">
                <div class="col-md-6">
                  <q-btn
                    color="primary"
                    type="submit"
                    :label="$q.lang.button.submit"
                    class="social_login_btn chnage-password"
                  />
                </div>

                <div class="col-md-6">
                  <q-btn
                    @click="cancel"
                    outline
                    :to="{ name: 'home' }"
                    style="color: #55267c"
                    :label="$q.lang.button.cancel"
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
import { ref } from "vue";
import { useAuthStore } from "src/stores/auth";
import notification from "src/boot/notification";
import { useRoute, useRouter } from "vue-router";
import { Loading, QSpinnerGears } from "quasar";

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

function cancel() {
  history.go(-1);
}

function onSubmit() {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  var formData = {
    currentPassword: data.value.current_password,
    newPassword: data.value.password_confirmation,
  };
  store
    .changePassword(formData)
    .then((res) => {
      if (res.success) {
        notification.success(res.message);
        router.push({ name: "home" });
        Loading.hide();
      }
      // else if (res.success == false) {
      //   notification.error("current password is incorrect");
      // }
    })
    .catch((err) => {
      if (err.response) {
        errors.value = err.response.message;
      }
      Loading.hide();
    })
    .finally(() => {
      Loading.hide();
    });
}
</script>

<style lang="scss">
@import "src/css/auth.scss";
@import "src/css/responsive.scss";
//$
</style>

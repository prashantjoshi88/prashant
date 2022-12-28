<template>
  <div class="q-pa-md login_form">
    <div class="forgote-page-header">
      <div class="authentication-container">
        <div class="responsive-logo">
          <div class="header-logo">
            <img src="~assets/images/logo.png" alt="" />
          </div>
        </div>

        <div class="align-center-box">
          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <div class="user_account_header">
              <h3 class="title">2-Step-Verification</h3>
              <p class="small_title">
                This extra step shows it’s really you trying to sign in
              </p>
            </div>
            <div class="row google-mail">
              <div class="text-field">
                <div class="capital-name">
                  <h4 class="nameLogo">{{ email.charAt(0) }}</h4>
                </div>
                <div class="main-box">
                  <h3>{{ email }}</h3>
                </div>
              </div>
            </div>

            <div>
              <h3 class="small-title-verification">2-Step-Verification</h3>
              <p class="step-line">
                Get your verification code from <br />
                in google authentication app
              </p>
            </div>

            <div class="q-mb-md otpfield">
              <v-otp-input
                input-classes="otp-input"
                class="numberbox q-pa-md"
                separator="-"
                :num-inputs="6"
                :should-auto-focus="true"
                :is-input-num="true"
                @on-complete="handleOnComplete"
              />
            </div>
            <div class="text-center">
              <q-btn
                type="submit"
                color="primary"
                label="Next"
                class="social_login_btn button-checkout-margin"
              />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VOtpInput from "vue3-otp-input";
import { useAuthStore } from "src/stores/auth";
import { ref } from "vue";
import { LocalStorage } from "quasar";
import { useRouter } from "vue-router";
import notification from "src/boot/notification";
import { Loading, QSpinnerGears } from "quasar";

const router = useRouter();
const store = useAuthStore();
const otp = ref("");
const handleOnComplete = (value) => {
  // data.value.otp = value;
  otp.value = value;
  onSubmit();
};
const email = LocalStorage.getItem("email");
function onSubmit() {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  var data = {
    token: otp.value,
  };
  store
    .twoFactorVerify(data)
    .then((res) => {
      if (res.success) {
        LocalStorage.set("confirmTwoFactor", true);
        // LocalStorage.set("isTwoFactor", true);
        router.push({ name: "home" });
        Loading.hide();
      } else if (res.success == false) {
        notification.error(" verification code is wrong ");
      } else {
        // LocalStorage.set("isTwoFactor", false);
        LocalStorage.set("confirmTwoFactor", false);
        router.push({ name: "sign-in" });
        Loading.hide();
      }
    })
    .finally(() => {
      Loading.hide();
    });
  // if (otp.value == "000000") {
  //   LocalStorage.set("confirmTwoFactor", true);
  //   LocalStorage.set("isTwoFactor", true);
  //   router.push({ name: "home" });
  //   Loading.hide();
  // }
}
</script>

<style lang="scss">
@import "src/css/auth.scss";
@import "src/css/responsive.scss";

// $
</style>

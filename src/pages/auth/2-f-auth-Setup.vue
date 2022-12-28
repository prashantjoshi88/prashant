<template>
  <div class="q-pa-md login_form">
    <div class="forgote-page-header">
      <div class="align-center-box-auth">
        <div class="user_account_header">
          <h3 class="title-auth">Two-factor authentication</h3>
          <hr />
          <div class="text-center">
            <h3 class="title-auth-1">Scan this QR code with your app</h3>
            <p class="small_title-qrscan">
              Scan the QR code below with the two-factor authentication app on
              your phone.
            </p>

            <!-- <div class="qr-code">
              <img src="~assets/images/qrcode.png" alt="" />
            </div> -->
            <div class="qr-code">
              <QRCodeVue3
                :value="qrValue"
                :width="200"
                :height="200"
                :qrOptions="{
                  typeNumber: '0',
                  mode: 'Byte',
                  errorCorrectionLevel: 'Q',
                }"
                :imageOptions="{
                  hideBackgroundDots: true,
                  imageSize: 0.4,
                  margin: 0,
                }"
                :dotsOptions="{ type: 'square', color: '#000' }"
                :cornersSquareOptions="{ type: 'square', color: '#0e013c' }"
              />
            </div>
            <!-- <div class="text-center"> -->
            <div>
              <h3 class="small-title-verification">
                Enter the six-digit code from the application
              </h3>
              <p class="step-line q-mt-sm">
                After scanning the QR code image, the app will display a code
                that you can enter below.
              </p>
            </div>

            <q-input
              outlined
              class="code-qr-scan q-pt-sm"
              v-model="qrOtp"
              placeholder="X  X  X  X  X  X "
              :dense="dense"
              oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
              type="number"
              maxlength="6"
            />
            <div class="btn-conform-1 q-pt-lg">
              <q-btn
                @click="cancel"
                outline
                style="color: #55267c"
                type="submit"
                :label="$q.lang.button.cancel"
                class="social_login_btn chnage-password auth-facter"
              />
              <q-btn
                @click="onSubmit"
                color="primary"
                type="submit"
                :label="$q.lang.button.continue"
                class="social_login_btn chnage-password auth-facter"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- </div> -->
</template>

<script setup>
import VOtpInput from "vue3-otp-input";
import { ref } from "vue";

import useServerError from "src/composables/useServerError";
import { useAuthStore } from "src/stores/auth";
import { useRouter, useRoute } from "vue-router";
import QRCodeVue3 from "qrcode-vue3";
import { LocalStorage, Notify } from "quasar";
import { Loading, QSpinnerGears } from "quasar";

const { errors, serverValidationError } = useServerError();
const store = useAuthStore();
const router = useRouter();
const qrValue = ref("");
const qrOtp = ref("");

const route = useRoute();
const routeName = route;

function onSubmit() {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  var data = {
    token: qrOtp.value,
  };
  store
    .twoFactorConfirm(data)
    .then((res) => {
      if (res.success) {
        LocalStorage.set("isTwoFactor", true);
        LocalStorage.set("confirmTwoFactor", true);

        router.push({ name: "home" });
        Loading.hide();
      } else {
        // LocalStorage.set("isTwoFactor", false);
        Notify.create({
          type: "negative",
          message: "Invalid OTP , Try again !",
        });
        Loading.hide();
        // router.push({ name: "sign-in" });
      }
    })
    .finally(() => {
      Loading.hide();
    });
}

function cancel() {
  if (route.name == "two-factor-authentication-setup") {
    store.logout();
    router.push({ name: "sign-in" });
  } else {
    router.push({ name: "home" });
  }
}

store.twoFactorConfigure().then((res) => {
  qrValue.value = res.data.otpauth_url;
});

const handleOnComplete = (value) => {
  data.value.otp = value;
};
</script>

<style lang="scss">
@import "src/css/auth.scss";
@import "src/css/responsive.scss";

// $
h3.title-auth {
  font-size: $value-30;
  padding-bottom: $value-30;
  font-weight: bold;
}

.user_account_header {
  p.small_title-qrscan {
    font-size: $value-19;
  }
}

h3.title-auth-1 {
  font-size: $value-25;
  padding-top: $value-20;
  padding-bottom: $value-15;
  font-weight: bold;
  color: #5c5c5c;
}

.qr-code {
  margin-top: $value-30 !important;
  margin-bottom: $value-30;
}

h3.small-title-verification {
  color: #000;
  font-size: $value-18;
  font-weight: map-get($font-weights, "medium");
}

.btn-conform-1 {
  text-align: right;
}
</style>

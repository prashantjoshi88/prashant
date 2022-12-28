<template>
  <div class="q-pa-md login_form">
    <div class="forgote-page-header">
      <div class="authentication-container">
        <logo />

        <div class="align-center-box">
          <div class="user_account_header">
            <h3 class="title">verify otp</h3>
            <p class="small_title">
              Please Enter four degit code sent to your email
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
          <q-btn
            color="primary"
            :label="$q.lang.authentication.otp.btn5"
            type="submit"
            class="social_login_btn"
          />
          <div class="q-pb-md text-center login-sec-txt"></div>
          <div class="text-center">
            <p class="login-bottom-text">
              {{ $q.lang.authentication.otp.subtitle4 }}
              <router-link :to="{ name: '' }">
                <span> {{ $q.lang.authentication.otp.a }}</span></router-link
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VOtpInput from "vue3-otp-input";
import { useRouter } from "vue-router";
import { defineAsyncComponent } from "vue";

const router = useRouter();

const handleOnComplete = (value) => {
  // data.value.otp = value;
  router.push({ name: "reset-password" });
};

const logo = defineAsyncComponent(() =>
  import("../../components/vha-logo.vue")
);
</script>

<style lang="scss">
@import "src/css/auth.scss";
@import "src/css/responsive.scss";
// $
</style>

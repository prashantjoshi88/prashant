<template>
  <div class="q-pa-md login_form">
    <div class="forgote-page-header">
      <div class="align-center-box-auth">
        <div class="user_account_header">
          <h3 class="title">Change Two factor authentication.</h3>
          <p class="small_title">
            Two-factor authentication adds an additional layer of security to
            your account by requiring more than just a password to sign in.
          </p>

          <q-btn
            color="primary"
            type="submit"
            :label="$q.lang.authentication.twoFactorSecurity.btn"
            class="social_login_btn"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VOtpInput from "vue3-otp-input";

const handleOnComplete = (value) => {
  data.value.otp = value;
};
</script>

<style lang="scss">
@import "src/css/auth.scss";
// $
</style>

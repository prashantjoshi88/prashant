<template>
  <div class="overlay">
    <div class="min-close">
      <div class="modal">
        <q-form @submit="unlock">
          <div class="popup-title">
            <div class="icon-lock">
              <i class="las la-lock"></i>
            </div>

            <h1>Enter your 6 digit code</h1>

            <div class="q-mb-md otpfield">
              <v-otp-input
                input-classes="otp-input"
                class="numberbox q-pa-md"
                separator="-"
                :num-inputs="6"
                :should-auto-focus="true"
                :is-input-num="true"
                @on-complete="handleOnComplete"
                @on-change="handleOnChange"
              />
            </div>

            <!-- <span v-if="errorMessage.length" class="">{{ errorMessage }}</span> -->

            <div class="button-lock">
              <q-btn
                type="submit"
                class="btn-lock-screen"
                color="primary"
                label="Unlock"
                @click="unlock"
              />

              <q-btn
                @click="logout"
                outline
                color="primary"
                class="btn-lock-screen"
                label="Logout"
              />
            </div>

            <q-chip v-if="errorMessage.length">
              <q-avatar icon="warning" color="red" text-color="white" />
              {{ errorMessage }}
            </q-chip>

            <!-- <q-input
            outlined
            v-model="text"
            placeholder="password"
            bg-color="grey"
            :dense="dense"
          >
            <template v-slot:append>
              <q-icon class="las la-eye-slash" />
            </template>
          </q-input> -->
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import VOtpInput from "vue3-otp-input";

import { LocalStorage, Notify } from "quasar";
import { useAuthStore } from "src/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Loading, QSpinnerGears } from "quasar";

import notification from "src/boot/notification";

const router = useRouter();

const otp = ref("");
const errorMessage = ref("");

const handleOnChange = (value) => {
  // console.log('OTP changed: ', value);
  errorMessage.value = "";
};

const handleOnComplete = (value) => {
  otp.value = value;
  unlock();
};

const store = useAuthStore();
function unlock() {
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
        LocalStorage.set("LockScreen", false);
        store.openPopup = false;
        router.go();
        Loading.hide();
      } else if (res.success == false) {
        errorMessage.value = "verification code is wrong";
        // notification.error(" verification code is wrong ");
        // otp.value = "";
        Loading.hide();
      }
    })
    .finally(() => {
      Loading.hide();
    });
  // LocalStorage.set("timer", 5);
  // if (otp.value == "000000") {
  //   LocalStorage.set("LockScreen", false);
  //   store.openPopup = false;
  //   router.go();
  // }
}

function logout() {
  store.logout();
  LocalStorage.set("LockScreen", false);
  store.openPopup = false;
}
</script>

<style lang="scss">
// $
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 40%);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
}

.modal {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
}

.popup-title {
  text-align: center;

  h1 {
    font-size: 18px;
    font-weight: 400;
    padding-bottom: 10px;
  }
}

.unlock-btn {
  text-align: center;
  border: 2px solid #ccc;
  display: inline-block;
  padding: 0px 10px 0px 9px;
  border-radius: center;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #000;
  margin-top: 20px;

  .q-btn {
    font-weight: bold;
  }
}

.icon-lock {
  margin-bottom: 20px;

  i {
    font-size: 35px;
    border: 1px solid #e0e0e0;
    border-radius: 50px;
    padding: 18px;
    background-color: #e0e0e0;
    color: #000;
  }
}

.otp-input {
  margin-left: 10px !important;
}

.button-lock {
  display: flex;
  justify-content: space-evenly;
  padding-top: 10px;
  padding-bottom: 30px;

  .btn-lock-screen {
    justify-content: center;
    line-height: normal;
    border-radius: 5px;
    font-weight: 700;
    display: flex;
    width: 40%;
    padding-top: 10px;
    align-items: center;
    padding-bottom: 10px;
  }
}
</style>

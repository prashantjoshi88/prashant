import { defineStore } from "pinia";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import notification from "src/boot/notification";
import { LocalStorage } from "quasar";
import { useRouter } from "vue-router";

//TODO Prefix set for API

const API_PREFIX_1 = "auth"; // API_PREFIX_1 for auth
const LOGIN = API_PREFIX_1 + "/login";
const TWO_FACTOR_VERIFY = API_PREFIX_1 + "/loginwithTFA";
const LOGOUT = API_PREFIX_1 + "/logout";
const API_PREFIX_2 = "profile"; // API_PREFIX_2 for Profile
const TWO_FACTOR_CONFIGURE = API_PREFIX_2 + "/configure-2fa";
const TWO_FACTOR_CONFIRM = API_PREFIX_2 + "/configure-2fa-confirm";
const CHANGE_PASSWORD = API_PREFIX_2 + "/change-password";
const ME = API_PREFIX_2 + "/me";
const FORGOT_PASSWORD = "/forgot-password";
const UPDATE_PASSWORD = "/update-password";
const VERIFY_OTP = "/verify-otp";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: LocalStorage.getItem("user") || "",
    accessToken: LocalStorage.getItem("access_token") || "",
    lockCount: 0,
    openPopup: LocalStorage.getItem("LockScreen") || false,
    superUser: LocalStorage.getItem("superUser") || "",
  }),

  getters: {
    getUser() {
      return this.user;
    },

    isLoggedIn() {
      return !!this.accessToken;
    },
    isSuperUser() {
      if (this.superUser == 1) {
        return true;
      } else if (this.superUser == 0) {
        return false;
      }
    },
  },

  actions: {
    async signIn(data) {
      return new Promise((resolve, reject) => {
        api
          .post(LOGIN, data)
          .then((res) => {
            if (res.success) {
              this.accessToken = res.data.token;
              LocalStorage.set("access_token", this.accessToken);
              this.getProfile();
            } else {
              notification.error(res.message);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async twoFactorConfigure(data) {
      return new Promise((resolve, reject) => {
        api
          .get(TWO_FACTOR_CONFIGURE, data)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async twoFactorConfirm(data) {
      return new Promise((resolve, reject) => {
        api
          .post(TWO_FACTOR_CONFIRM, data)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async twoFactorVerify(data) {
      return new Promise((resolve, reject) => {
        api
          .post(TWO_FACTOR_VERIFY, data)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async forgotPassword(data) {
      return new Promise((resolve, reject) => {
        api
          .post(FORGOT_PASSWORD, data)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updatePassword(data) {
      return new Promise((resolve, reject) => {
        api
          .post(UPDATE_PASSWORD, data)
          .then((res) => {
            if (res.success) {
              notification.success(res.message);
            } else {
              notification.error(res.message);
            }
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async changePassword(data) {
      return new Promise((resolve, reject) => {
        api
          .post(CHANGE_PASSWORD, data)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async verifyOtp(data) {
      return new Promise((resolve, reject) => {
        api
          .post(VERIFY_OTP, data)
          .then((res) => {
            if (res.success) {
              notification.success(res.message);
            } else {
              notification.error(res.message);
            }
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    async logout() {
      return new Promise((resolve, reject) => {
        api.get(LOGOUT);
        LocalStorage.remove("access_token");
        LocalStorage.remove("user");
        LocalStorage.remove("serviceList");
        LocalStorage.remove("email");
        LocalStorage.remove("isTwoFactor");
        LocalStorage.remove("confirmTwoFactor");
      });
    },

    async getProfile() {
      return new Promise((resolve, reject) => {
        api
          .get(ME)
          .then((res) => {
            if (res.success) {
              this.user = res.data;
              this.superUser = res.data.is_super_admin;
              LocalStorage.set("user", this.user);
              LocalStorage.set("superUser", this.superUser);
            } else {
              notification.error(res.message);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { WELLNESS_TIPS } from "src/apis/constant";
import notification from "src/boot/notification";
export const wellnessTipsStore = defineStore("wellnessTips", {
  state: () => ({
    wellnessTipsList: [],
    currentWellnessTips: {},
  }),

  getters: {
    getWellnessTips() {
      return this.currentWellnessTips;
    },
  },

  actions: {
    async fetchWellnessTipsList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(WELLNESS_TIPS.LIST)
          .then((res) => {
            if (res.success) {
              this.wellnessTipsList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewWellnessTips(data) {
      return new Promise((resolve, reject) => {
        api
          .post(WELLNESS_TIPS.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.wellnessTipsList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updateWellnessTips(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(WELLNESS_TIPS.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.wellnessTipsList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deleteWellnessTips(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(WELLNESS_TIPS.DELETE, { id: data }))
          .then((res) => {
            if (res.success) {
              notification.success(res.message || "user has been deleted");
            }
            resolve(res);
          })
          .catch((error) => {
            notification.success(error.message);
            reject(error);
          });
      });
    },

    async fetchWellnessTips(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(WELLNESS_TIPS.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentWellnessTips = res.data;
              resolve(res);
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

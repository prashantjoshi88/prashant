import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { READINESS } from "src/apis/constant";
import notification from "src/boot/notification";
export const readinessStore = defineStore("readiness", {
  state: () => ({
    readinessList: [],
    currentReadiness: {},
  }),

  getters: {
    getReadiness() {
      return this.currentReadiness;
    },
  },

  actions: {
    async fetchReadinessList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(READINESS.LIST)
          .then((res) => {
            if (res.success) {
              this.readinessList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewReadiness(data) {
      return new Promise((resolve, reject) => {
        api
          .post(READINESS.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.readinessList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updateReadiness(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(READINESS.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.readinessList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deleteReadiness(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(READINESS.DELETE, { id: data }))
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

    async fetchReadiness(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(READINESS.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentReadiness = res.data;
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

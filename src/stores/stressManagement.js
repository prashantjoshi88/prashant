import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { STRESS_MANAGEMENT } from "src/apis/constant";
import notification from "src/boot/notification";
export const stressManagementStore = defineStore("stressManagement", {
  state: () => ({
    stressManagementList: [],
    currentStressManagement: {},
  }),

  getters: {
    getStressManagement() {
      return this.currentStressManagement;
    },
  },

  actions: {
    async fetchStressManagementList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(STRESS_MANAGEMENT.LIST)
          .then((res) => {
            if (res.success) {
              this.stressManagementList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewStressManagement(data) {
      return new Promise((resolve, reject) => {
        api
          .post(STRESS_MANAGEMENT.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.stressManagementList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updateStressManagement(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(STRESS_MANAGEMENT.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.stressManagementList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deleteStressManagement(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(STRESS_MANAGEMENT.DELETE, { id: data }))
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

    async fetchStressManagement(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(STRESS_MANAGEMENT.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentStressManagement = res.data;
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

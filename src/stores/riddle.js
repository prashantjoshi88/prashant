import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { RIDDLE } from "src/apis/constant";
import notification from "src/boot/notification";
export const riddleStore = defineStore("riddle", {
  state: () => ({
    riddleList: [],
    currentRiddle: {},
  }),

  getters: {
    getRiddle() {
      return this.currentRiddle;
    },
  },

  actions: {
    async fetchRiddleList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(RIDDLE.LIST)
          .then((res) => {
            if (res.success) {
              this.riddleList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewRiddle(data) {
      return new Promise((resolve, reject) => {
        api
          .post(RIDDLE.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.riddleList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updateRiddle(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(RIDDLE.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.riddleList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deleteRiddle(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(RIDDLE.DELETE, { id: data }))
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

    async fetchRiddle(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(RIDDLE.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentRiddle = res.data;
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

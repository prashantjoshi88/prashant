import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { DOODLE } from "src/apis/constant";
import notification from "src/boot/notification";
export const doodleStore = defineStore("doodle", {
  state: () => ({
    doodleList: [],
    currentDoodle: {},
  }),

  getters: {
    getDoodle() {
      return this.currentDoodle;
    },
  },

  actions: {
    async fetchDoodleList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(DOODLE.LIST)
          .then((res) => {
            if (res.success) {
              this.doodleList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewDoodle(data) {
      return new Promise((resolve, reject) => {
        api
          .post(DOODLE.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.doodleList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updateDoodle(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(DOODLE.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.doodleList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deleteDoodle(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(DOODLE.DELETE, { id: data }))
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

    async fetchDoodle(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(DOODLE.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentDoodle = res.data;
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

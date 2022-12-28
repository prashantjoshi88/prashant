import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { VIBE } from "src/apis/constant";
import notification from "src/boot/notification";
export const vibeStore = defineStore("vibe", {
  state: () => ({
    vibeList: [],
    currentVibe: {},
  }),

  getters: {
    getVibe() {
      return this.currentVibe;
    },
  },

  actions: {
    async fetchVibeList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(VIBE.LIST)
          .then((res) => {
            if (res.success) {
              this.vibeList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewVibe(data) {
      return new Promise((resolve, reject) => {
        api
          .post(VIBE.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.vibeList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updateVibe(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(VIBE.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.vibeList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deleteVibe(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(VIBE.DELETE, { id: data }))
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

    async fetchVibe(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(VIBE.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentVibe = res.data;
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

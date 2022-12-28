import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { PLATFORM_MASTER } from "src/apis/constant";
import notification from "src/boot/notification";
export const platformMasterStore = defineStore("platformMaster", {
  state: () => ({
    platformMasterList: LocalStorage.getItem("platform") ?? [],
    currentPlatformMaster: {},
  }),

  getters: {
    getPlatformMaster() {
      return this.currentPlatformMaster;
    },
  },

  actions: {
    async fetchPlatformMasterList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(PLATFORM_MASTER.LIST)
          .then((res) => {
            if (res.success) {
              this.platformMasterList = res.data;
              LocalStorage.set("platform", this.platformMasterList);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewPlatformMaster(data) {
      return new Promise((resolve, reject) => {
        api
          .post(PLATFORM_MASTER.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.platformMasterList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updatePlatformMaster(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(PLATFORM_MASTER.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.platformMasterList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deletePlatformMaster(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(PLATFORM_MASTER.DELETE, { id: data }))
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

    async fetchPlatformMaster(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(PLATFORM_MASTER.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentPlatformMaster = res.data;
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

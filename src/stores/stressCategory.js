import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { SMM_CATEGORY } from "src/apis/constant";
import notification from "src/boot/notification";
export const stressCategoryStore = defineStore("stressCategory", {
  state: () => ({
    stressCategoryList: [],
    currentStressCategory: {},
  }),

  getters: {
    getStressCategory() {
      return this.currentStressCategory;
    },
  },

  actions: {
    async fetchStressCategoryList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(SMM_CATEGORY.LIST)
          .then((res) => {
            if (res.success) {
              this.stressCategoryList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewStressCategory(data) {
      return new Promise((resolve, reject) => {
        api
          .post(SMM_CATEGORY.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.stressCategoryList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updateStressCategory(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(SMM_CATEGORY.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.stressCategoryList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deleteStressCategory(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(SMM_CATEGORY.DELETE, { id: data }))
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

    async fetchStressCategory(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(SMM_CATEGORY.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentStressCategory = res.data;
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

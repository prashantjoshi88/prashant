import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { BEHAVIORAL_CATEGORY } from "src/apis/constant";
import notification from "src/boot/notification";
export const behavioralCategoryStore = defineStore("behavioralCategory", {
  state: () => ({
    behavioralCategoryList: [],
    currentBehavioralCategory: {},
  }),

  getters: {
    getBehavioralCategory() {
      return this.currentBehavioralCategory;
    },
  },

  actions: {
    async fetchBehavioralCategoryList(data) {
      return new Promise((resolve, reject) => {
        api
          .getWithParam(BEHAVIORAL_CATEGORY.LIST, data)
          .then((res) => {
            if (res.success) {
              this.behavioralCategoryList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewBehavioralCategory(data) {
      return new Promise((resolve, reject) => {
        api
          .post(BEHAVIORAL_CATEGORY.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.behavioralCategoryList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updateBehavioralCategory(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(BEHAVIORAL_CATEGORY.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.behavioralCategoryList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deleteBehavioralCategory(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(BEHAVIORAL_CATEGORY.DELETE, { id: data }))
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

    async fetchBehavioralCategory(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(BEHAVIORAL_CATEGORY.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentBehavioralCategory = res.data;
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

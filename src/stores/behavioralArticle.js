import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { BEHAVIORAL_ARTICLE } from "src/apis/constant";
import notification from "src/boot/notification";
export const behavioralArticleStore = defineStore("behavioralArticle", {
  state: () => ({
    behavioralArticleList: [],
    currentBehavioralArticle: {},
  }),

  getters: {
    getBehavioralArticle() {
      return this.currentBehavioralArticle;
    },
  },

  actions: {
    async fetchBehavioralArticleList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(BEHAVIORAL_ARTICLE.LIST)
          .then((res) => {
            if (res.success) {
              this.behavioralArticleList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewBehavioralArticle(data) {
      return new Promise((resolve, reject) => {
        api
          .post(BEHAVIORAL_ARTICLE.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.behavioralArticleList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updateBehavioralArticle(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(BEHAVIORAL_ARTICLE.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.behavioralArticleList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deleteBehavioralArticle(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(BEHAVIORAL_ARTICLE.DELETE, { id: data }))
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

    async fetchBehavioralArticle(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(BEHAVIORAL_ARTICLE.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentBehavioralArticle = res.data;
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

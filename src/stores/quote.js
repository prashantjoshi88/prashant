import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { QUOTE } from "src/apis/constant";
import notification from "src/boot/notification";
export const quoteStore = defineStore("quote", {
  state: () => ({
    quoteList: [],
    currentQuote: {},
  }),

  getters: {
    getQuote() {
      return this.currentQuote;
    },
  },

  actions: {
    async fetchQuoteList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(QUOTE.LIST)
          .then((res) => {
            if (res.success) {
              this.quoteList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewQuote(data) {
      return new Promise((resolve, reject) => {
        api
          .post(QUOTE.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.quoteList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updateQuote(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(QUOTE.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.quoteList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deleteQuote(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(QUOTE.DELETE, { id: data }))
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

    async fetchQuote(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(QUOTE.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentQuote = res.data;
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

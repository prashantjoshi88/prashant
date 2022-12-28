import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { PHQ_QUESTION } from "src/apis/constant";
import notification from "src/boot/notification";
export const phq_QuestionStore = defineStore("phq_Question", {
  state: () => ({
    phq_QuestionList: [],
    currentPhq_Question: {},
  }),

  getters: {
    getPhq_Question() {
      return this.currentPhq_Question;
    },
  },

  actions: {
    async fetchPhq_QuestionList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(PHQ_QUESTION.LIST)
          .then((res) => {
            if (res.success) {
              this.phq_QuestionList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewPhq_Question(data) {
      return new Promise((resolve, reject) => {
        api
          .post(PHQ_QUESTION.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.phq_QuestionList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updatePhq_Question(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(PHQ_QUESTION.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.phq_QuestionList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deletePhq_Question(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(PHQ_QUESTION.DELETE, { id: data }))
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

    async fetchPhq_Question(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(PHQ_QUESTION.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentPhq_Question = res.data;
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

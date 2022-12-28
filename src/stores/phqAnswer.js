import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { PHQ_ANSWER } from "src/apis/constant";
import notification from "src/boot/notification";
export const phq_AnswerStore = defineStore("phq_Answer", {
  state: () => ({
    phq_AnswerList: [],
    currentPhq_Answer: {},
  }),

  getters: {
    getPhq_Answer() {
      return this.currentPhq_Answer;
    },
  },

  actions: {
    async fetchPhq_AnswerList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(PHQ_ANSWER.LIST)
          .then((res) => {
            if (res.success) {
              this.phq_AnswerList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewPhq_Answer(data) {
      return new Promise((resolve, reject) => {
        api
          .post(PHQ_ANSWER.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.phq_AnswerList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updatePhq_Answer(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(PHQ_ANSWER.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.phq_AnswerList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deletePhq_Answer(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(PHQ_ANSWER.DELETE, { id: data }))
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

    async fetchPhq_Answer(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(PHQ_ANSWER.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentPhq_Answer = res.data;
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

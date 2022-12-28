import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { MUSIC_THERAPY } from "src/apis/constant";
import notification from "src/boot/notification";
export const musicTherapyStore = defineStore("musicTherapy", {
  state: () => ({
    musicTherapyList: [],
    currentMusicTherapy: {},
  }),

  getters: {
    getMusicTherapy() {
      return this.currentMusicTherapy;
    },
  },

  actions: {
    async fetchMusicTherapyList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(MUSIC_THERAPY.LIST)
          .then((res) => {
            if (res.success) {
              this.musicTherapyList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async saveNewMusicTherapy(data) {
      return new Promise((resolve, reject) => {
        api
          .post(MUSIC_THERAPY.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.musicTherapyList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updateMusicTherapy(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(MUSIC_THERAPY.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.musicTherapyList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deleteMusicTherapy(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(MUSIC_THERAPY.DELETE, { id: data }))
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

    async fetchMusicTherapy(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(MUSIC_THERAPY.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentMusicTherapy = res.data;
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

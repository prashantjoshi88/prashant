import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { WELLNESS_CATEGORY } from "src/apis/constant";
import notification from "src/boot/notification";
export const wellnessCatStore = defineStore("wellnessCat", {
  state: () => ({
    wellnessCatList: LocalStorage.getItem("wellnessCatList") ?? [],
    currentWellnessCat: {},
  }),

  getters: {
    getWellnessCat() {
      return this.currentWellnessCat;
    },
  },

  actions: {
    async fetchWellnessCatList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(WELLNESS_CATEGORY.LIST)
          .then((res) => {
            if (res.success) {
              this.wellnessCatList = res.data;
              LocalStorage.set("wellnessCatList", this.wellnessCatList);

              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // async fetchWellnessCategory(data) {
    //   return new Promise((resolve, reject) => {
    //     api
    //       .get(WELLNESS_CATEGORY.LIST)
    //       .then((res) => {
    //         if (res.success) {
    //           // this.organizationList = res.data;
    //           // console.log(res.data);
    //           // resolve(res);

    //           const cat = [];
    //           res.data.forEach((element) => {
    //             cat.push({
    //               label: element.title,
    //               value: element.id,
    //             });
    //           });
    //           this.wellnessCatList = cat;
    //           LocalStorage.set("wellnessCatList", this.wellnessCatList);
    //           resolve(res);
    //         }
    //         resolve(res);
    //       })
    //       .catch((error) => {
    //         reject(error);
    //       });
    //   });
    // },

    async saveNewWellnessCat(data) {
      return new Promise((resolve, reject) => {
        api
          .post(WELLNESS_CATEGORY.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.wellnessCatList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async updateWellnessCat(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(WELLNESS_CATEGORY.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.wellnessCatList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deleteWellnessCat(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(WELLNESS_CATEGORY.DELETE, { id: data }))
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

    async fetchWellnessCat(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(WELLNESS_CATEGORY.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentWellnessCat = res.data;
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

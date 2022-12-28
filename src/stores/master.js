import { defineStore } from "pinia";
import { LocalStorage } from "quasar";

export const useMasterStore = defineStore("master", {
  state: () => ({
    layout: LocalStorage.getItem("layout") ?? "grid",
  }),

  getters: {
    getLayoutType() {
      return this.layout;
    },
  },

  actions: {},
});

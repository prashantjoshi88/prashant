import { boot } from "quasar/wrappers";
import { LocalStorage } from "quasar";
import Notify from "boot/notification";

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    if (
      to.matched.some((record) => record.meta.requiresAuth) &&
      !LocalStorage.getItem("access_token")
    ) {
      console.log("not authenticated");
      Notify.error("You must be logged in to view this page.");
      return next({
        name: "sign-in",
      });
    } else if (
      to.matched.some((record) => record.meta.requireGuest) &&
      LocalStorage.getItem("access_token")
    ) {
      return next({
        name: "two-factor-verification",
      });
    } else {
      next();
    }
    // next();
  });
});

import { LocalStorage } from "quasar";
import { boot } from "quasar/wrappers";

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!LocalStorage.getItem("confirmTwoFactor")) {
        next({
          name: "two-factor-verification",
        });
      } else {
        next();
      }
    } else {
      if (
        to.name == "two-factor-verification" &&
        LocalStorage.getItem("confirmTwoFactor")
      ) {
        next({
          name: "home",
        });
      }
      next();
    }
  });
});

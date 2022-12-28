import { LocalStorage } from "quasar";
import { boot } from "quasar/wrappers";

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!LocalStorage.getItem("isTwoFactor")) {
        next({
          name: "two-factor-authentication-setup",
        });
      } else {
        next();
      }
    } else {
      if (
        to.name == "two-factor-authentication-setup" &&
        LocalStorage.getItem("isTwoFactor")
      ) {
        next({
          name: "home",
        });
      }
      next();
    }
  });
});

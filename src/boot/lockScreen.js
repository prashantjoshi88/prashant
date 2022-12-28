import { LocalStorage } from "quasar";
import { boot } from "quasar/wrappers";

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (LocalStorage.getItem("LockScreen") == true) {
        next(false);
      } else {
        next();
      }
    }
    next();
  });
});

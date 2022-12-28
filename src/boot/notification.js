import { Notify } from "quasar";

export default {
  error(message) {
    Notify.create({
      type: "negative",
      message: message,
    });
  },

  success(message) {
    Notify.create({
      type: "positive",
      message: message,
    });
  },

  info(message) {
    Notify.create({
      message: message,
    });
  },
};

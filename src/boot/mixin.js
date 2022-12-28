import { boot } from "quasar/wrappers";
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// import VueSocialSharing from 'vue-social-sharing';
// import { DateTime } from "luxon";

export default boot(({ app, store }) => {
  // app.use(VueSocialSharing)
  app.mixin({
    methods: {
      getHumanReadable(time) {
        return DateTime.fromISO(time).toRelative();
      },
      isBase64(str) {
        const base64 = /^[data]{4}[:]{1}/;
        return base64.test(str);
      },
      // Common validations start
      required(val, fieldName = null, dependentField = true) {
        // console.log(process.env.CLIENT_VALIDATION);
        if (process.env.CLIENT_VALIDATION)
          return dependentField
            ? (val && val.length > 0) || "Please enter a " + fieldName
            : false;

        return false;
      },
      isEmail(val) {
        const emailRegex =
          /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return emailRegex.test(val) || "Please enter a valid email address";
      },
      validatePassword(val) {
        var pass = /^\S*$/;
        if (val.match(pass)) {
          return true;
        } else {
          return "white space not allowed";
        }
      },
      isSpecialString(val) {
        const regex = /^[a-zA-Z0-9_.]+$/;
        return regex.test(val) || "Please enter a valid string";
      },
      isNumber(val) {
        const regex = /^([0-9])+$/;
        return regex.test(val) || "Please enter a only number";
      },
      isUrl(str) {
        var pattern = new RegExp(
          "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
          "i"
        ); // fragment locator
        return str !== null && str !== undefined
          ? pattern.test(str) || "Please enter valid url"
          : true;
      },
      alpha(val) {
        const regex = /^[a-zA-Z ]+$/;
        return regex.test(val) || "Please enter only alphabets";
      },
      min(val, min, fieldName = null) {
        return (
          val.length >= min ||
          "Please enter a minimum of " + min + " characters in " + fieldName
        );
      },
      max(val, max, fieldName = null) {
        return (
          val.length <= max ||
          "Please enter a maximum of " + max + " characters in " + fieldName
        );
      },
      between(val, min, max) {
        return (
          (val.length >= min && val.length <= max) ||
          "Please enter a value between " + min + " and " + max + " characters"
        );
      },
      // Common validations end
      createFolderValidation(val, max, type) {
        if (type === "Year") {
          const regex = /^([0-9])+$/;
          if (!regex.test(val)) {
            return "Please enter a only number";
          } else {
            return (
              val.length <= max ||
              "Please enter a maximum of " + max + " characters in " + type
            );
          }
        }
      },
    },
  });
});

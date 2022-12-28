import { api } from "boot/axios";
import Notify from "boot/notification";
import { LocalStorage, Quasar } from "quasar";

export default {
  get(url) {
    return new Promise((resolve, reject) => {
      api
        .get(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          this.showApiError(error);
          reject(error);
        });
    });
  },

  getWithParam(url, params, config = {}) {
    return new Promise((resolve, reject) => {
      api
        .get(url, { params: params, headers: config.headers })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          this.showApiError(error);
          reject(error);
        });
    });
  },

  post(url, data, config = {}) {
    return new Promise((resolve, reject) => {
      api
        .post(url, data, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          this.showApiError(error);

          reject(error);
        });
    });
  },

  postWithParam(url, data, params, config = {}) {
    return new Promise((resolve, reject) => {
      api
        .post(url, data, { params: params, headers: config.headers })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          this.showApiError(error);

          reject(error);
        });
    });
  },

  put(url, data) {
    return new Promise((resolve, reject) => {
      api
        .put(url, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          this.showApiError(error);

          reject(error);
        });
    });
  },

  delete(url, data) {
    return new Promise((resolve, reject) => {
      api
        .delete(url, { data: data })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          this.showApiError(error);

          reject(error);
        });
    });
  },

  resolveApiUrl(url, json) {
    for (var key of Object.keys(json)) {
      url = url.replace(`:${key}`, json[key]);
    }
    return url;
  },

  showApiError(error) {
    if (error.response) {
      // console.log(error.response.data.data);
      // Request made and server responded
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      if (error.response.status == 401) {
        LocalStorage.remove("access_token");
        LocalStorage.remove("user");
        Notify.error("Your session has expired. Please login again.");
        location.reload();
        // router.push({ name: "sign-in" });
      } else if (error.response.status == 419) {
        location.reload();
      } else if (error.response.status == 500) {
        Notify.error(
          "There's been a glitch. We're not quite sure what went wrong. Please try again later."
        );
      } else if (error.response.status == 404) {
        if (!error.response.data.message) {
          Notify.error("The requested resource was not found.");
        }
        // Notify.error(error.response.data.message ?? "The requested resource was not found.");
      } else {
        // console.log(error.response.data);
        let errorMessage = error?.response?.data?.errors;
        if (errorMessage) {
          if (errorMessage.required) {
          } else {
            // const er = [...errorMessage].shift();
            // const [er] = errorMessage;
            // console.log(er);
            // Notify.error(er[0].message);
            Notify.error("Data validation failed");
            return;
          }
        } else if (error?.response?.data?.code) {
          const code = error?.response?.data?.code;
          if (code == "ER_DUP_ENTRY") {
            Notify.error(
              "Please check your input. This value is already in use."
            );
          } else if (code == "E_ROW_NOT_FOUND") {
            Notify.error(Quasar.lang.props.errors.notFound);
          }
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      // console.log(error.request);
      Notify.error("The request was made but no response was received");
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.log("Error", error?.message);
      Notify.error(error.message);
    }
  },
};

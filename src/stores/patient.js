import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import api from "src/apis/index"; // Custom middle api js to handle all api requests and custom
import { PATIENT, ORGANIZATION } from "src/apis/constant";
import notification from "src/boot/notification";
export const patientStore = defineStore("patient", {
  state: () => ({
    // serviceList: [],
    patientList: [],
    organizationList: LocalStorage.getItem("organizationList") ?? [],
    getCounter: [],
    getConsolidatedCounter: [],
    orgWisePatient: [],
    // currentPatient: {},
    // patientCounter: [],
  }),

  getters: {
    getPatient() {
      return this.currentPatient;
    },
    getOrganization() {
      return this.organizationList;
    },
    // getCounter() {
    //   return this.patientCounter;
    // },
  },

  actions: {
    async fetchPatientList(data) {
      return new Promise((resolve, reject) => {
        api
          .get(PATIENT.LIST)
          .then((res) => {
            if (res.success) {
              this.patientList = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async fetchOrganization(data) {
      return new Promise((resolve, reject) => {
        api
          .get(ORGANIZATION.LIST)
          .then((res) => {
            if (res.success) {
              // this.organizationList = res.data;
              // console.log(res.data);
              // resolve(res);

              const org = [];
              res.data.forEach((element) => {
                org.push({
                  label: element.name,
                  value: element.id,
                });
              });
              this.organizationList = org;
              LocalStorage.set("organizationList", this.organizationList);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async selectOrg(data) {
      return new Promise((resolve, reject) => {
        api
          .post("filters", data)
          .then((res) => {
            if (res.success) {
              // console.log("~~~~~~~~~~~~~", res);
              const org = [];
              res.data.forEach((element) => {
                org.push({
                  label: element.patient_cr,
                  value: element.id,
                });
              });
              this.orgWisePatient = org;
              // console.log(this.orgWisePatient);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async fetchPatientCounter(data) {
      return new Promise((resolve, reject) => {
        api
          .get("patient/counter")
          .then((res) => {
            if (res.success) {
              this.getCounter = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async fetchConsolidatedCounter(data) {
      return new Promise((resolve, reject) => {
        api
          .post("dashboard/total-patient", data)
          .then((res) => {
            if (res.success) {
              this.getConsolidatedCounter = res.data;
              console.log(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    async deletePatient(data) {
      return new Promise((resolve, reject) => {
        api
          .delete(api.resolveApiUrl(PATIENT.DELETE, { id: data }))
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

    async fetchPatient(slug) {
      return new Promise((resolve, reject) => {
        api
          .get(api.resolveApiUrl(PATIENT.SHOW, { id: slug }))
          .then((res) => {
            if (res.success) {
              this.currentUser = res.data;
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async saveNewPatient(data) {
      return new Promise((resolve, reject) => {
        api
          .post(PATIENT.SAVE, data)
          .then((res) => {
            if (res.success) {
              this.patientList.push(res.data);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    async importPatient(data, header) {
      return new Promise((resolve, reject) => {
        api
          .post("import", data, header)
          .then((res) => {
            if (res.success) {
              console.log(res);
              resolve(res);
            }
            resolve(res);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    async updatePatient(data, id) {
      return new Promise((resolve, reject) => {
        api
          .post(api.resolveApiUrl(PATIENT.UPDATE, { id: id }), data)
          .then((res) => {
            if (res.success) {
              this.patientList.push(res.data);
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

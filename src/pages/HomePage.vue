<template>
  <div class="q-pa-md login_form">
    <div class="forgote-page-header">
      <div class="home_user_header">
        <h3 class="comman-title">Dashboard</h3>
      </div>
      <div class="q-pa-md main-wrapper">
        <div class="bg-box bg-res">
          <div class="row q-col-gutter-lg flex-direction dash_info_color_box">
            <div class="col-md-3">
              <router-link
                class="col-md-3 text-black"
                :to="{ name: 'patient-dashboard' }"
              >
                <div class="sub-box sub-box-total">
                  <div class="sub-img-total sub-img">
                    <img src="~assets/images/totaluser.svg" alt="" />
                  </div>

                  <div class="sub-box-text q-mt-md q-pl-md">
                    <h5 class="title">{{ counter.total_patient }}</h5>
                    <p>Total Patients</p>
                  </div>
                </div>
              </router-link>
            </div>

            <div class="col-md-3" v-for="items in counter.count" :key="items">
              <router-link
                class="col-md-3 text-black"
                :to="{
                  name: 'patient-dashboard',
                  query: { slug: items.org_id },
                }"
              >
                <div class="sub-box sub-box-online">
                  <div class="sub-img-online sub-img">
                    <img src="~assets/images/onlineuser.svg" alt="" />
                  </div>
                  <div class="sub-box-text q-mt-md q-pl-md">
                    <h5 class="title">{{ items.patient_count }}</h5>
                    <p>{{ items.org_name }}</p>
                  </div>
                </div>
              </router-link>
            </div>

            <!-- <router-link
              class="col-md-3 text-black"
              :to="{ name: 'patient-dashboard' }"
            >
              <div class="col-md-3">
                <div class="sub-box sub-box-total">
                  <div class="sub-img-total sub-img">
                    <img src="~assets/images/onlineuser.svg" alt="" />
                  </div>
                  <div class="sub-box-text q-mt-md q-pl-md">
                    <h5 class="title">{{ counter.online_users }}</h5>
                    <p>Online Patient</p>
                  </div>
                </div>
              </div>
            </router-link> -->
          </div>
        </div>

        <div class="row q-col-gutter-lg q-mt-md">
          <div class="col-md-6">
            <div class="home_card_box">
              <!-- <h5>PHQ -9</h5> -->
              <table-component
                ref="userTableComponent"
                apiUrl="dashboard/phq9-today"
                :columns="column('Answer')"
                noBottom="true"
                rowKey="id"
                title="PHQ -9"
              >
                <template v-slot:filter>
                  <h3 class="comman-title q-pa-none q-ma-none">
                    PHQ -9 (Today)
                  </h3>
                </template>
              </table-component>
            </div>
          </div>
          <div class="col-md-6">
            <div class="home_card_box">
              <!-- <h5>Readiness Ruler</h5> -->
              <table-component
                ref="userTableComponent"
                apiUrl="dashboard/rediness-ruler-today"
                :columns="column('Question')"
                noBottom="true"
                rowKey="id"
                title="Readiness Ruler"
              >
                <template v-slot:filter>
                  <h3 class="comman-title">Readiness Ruler (Today)</h3>
                </template>
              </table-component>
            </div>
          </div>

          <div class="col-md-12">
            <div class="home_card_box">
              <!-- <h5>Vibe O Meter</h5> -->
              <table-component
                ref="userTableComponent"
                apiUrl="dashboard/vib-month"
                :columns="column('Answer')"
                noBottom="true"
                rowKey="id"
                title="Vibe O Meter"
                ><template v-slot:filter>
                  <h3 class="comman-title">Vibe O Meter (This Month)</h3>
                </template></table-component
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { useAuthStore } from "src/stores/auth";
import { Loading, QSpinnerHourglass } from "quasar";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
// import { serviceStore } from "src/stores/service";
// import { serviceYearStore } from "src/stores/serviceYear";
// import { serviceYearProjectStore } from "src/stores/serviceYearProject";
import { patientStore } from "src/stores/patient";
import moment from "moment";

const store = patientStore();

store.fetchPatientCounter();
const counter = computed(() => {
  return store.getCounter;
});

const tableComponent = defineAsyncComponent(() =>
  import("src/components/table-component")
);

function column(QorA) {
  const columns = [
    {
      name: "id",
      label: "NO.",
      field: "index",
      // //sortable: true,
      align: "left",
    },

    {
      name: "patient",
      required: true,
      label: "Patient",
      align: "left",
      field: (row) => row.patient_name,
      format: (val) => `${val}`,
      // //sortable: true,
    },
    // {
    //   name: "email",
    //   required: true,
    //   label: "Email",
    //   align: "left",
    //   field: (row) => row.email,
    //   format: (val) => `${val}`,
    //   // //sortable: true,
    // },

    {
      name: "patient_cr",
      required: true,
      label: "Patient-CR",
      align: "left",
      field: (row) => row.patient_cr,
      format: (val) => `${val}`,
      // //sortable: true,
    },
    {
      name: "organization",
      align: "center",
      label: "Organization",
      field: (row) => row.org_name,
      format: (val) => `${val}`,
      //sortable: true,
    },

    {
      name: (row) => (row.answer ? "answer" : "question"),
      align: "center",
      label: QorA,
      field: (row) => row.answer ?? row.question,
      format: (val) => `${val}`,
      //sortable: true,
    },

    {
      name: "points",
      required: true,
      label: "Points",
      align: "left",
      field: (row) => row.points ?? row.point,
      format: (val) => `${val}`,
      // //sortable: true,
    },
    {
      name: "date",
      required: true,
      label: "Date",
      align: "left",
      field: (row) => moment(row.created_at).format("MM-DD-YYYY"),
      format: (val) => `${val}`,
      // //sortable: true,
    },
  ];

  return columns;
}

// const store = serviceStore();
// const yearStore = serviceYearStore();
// const projectStore = serviceYearProjectStore();
// const masterStore = useMasterStore();
// const route = useRoute();
// const router = useRouter();
// const path = ref(route.path);
// const layout = computed(() => {
//   return masterStore.getLayoutType;
// });
// const createBtn = ref("Service");
// const slug = ref("");
// const list = ref([]);
// const currentPage = ref(1);
// const limit = ref(10);
// const loading = ref(true);
// const scrollList = ref(null);

// Loading.show({
//   spinner: QSpinnerHourglass,
//   message: "Loading...",
// });

// watch(route, (newVal, oldVal) => {
//   store.serviceList = [];
//   yearStore.yearList = [];
//   projectStore.projectList = [];
//   scrollList.value.reset();
// });

// function getList(index, done) {
//   if (route.params.project) {
//     createBtn.value = "Files";
//     slug.value = route.params.project;
//   } else if (route.params.year) {
//     createBtn.value = "Project";
//     slug.value = route.params.year;
//   } else if (route.params.slug) {
//     createBtn.value = "Year";
//     slug.value = route.params.slug;
//   } else {
//     createBtn.value = "Service";
//   }

//   fetchList()
//     .then((res) => {
//       if (res.success && res.data.length > 0) {
//         currentPage.value = currentPage.value + 1;
//         done();
//       } else {
//         loading.value = false;
//         done(true);
//       }
//     })
//     .catch((err) => {
//       done(true);
//     })
//     .finally(() => {
//       Loading.hide();
//     });
// }

// async function fetchList() {
//   const data = {
//     limit: limit.value,
//     page: currentPage.value,
//   };
//   if (createBtn.value == "Service") {
//     const res = await store.getService(data);
//     list.value = store.getServiceList;
//     return res;
//   } else if (createBtn.value == "Year") {
//     const res_1 = await yearStore.getServiceYear(route.params.slug, data);
//     list.value = yearStore.getYearList;
//     return res_1;
//   } else if (createBtn.value == "Project") {
//     const res_2 = await projectStore.getProject(route.params.year, data);
//     list.value = projectStore.getProjectList;
//     return res_2;
//   }
// }

// onBeforeRouteLeave((to, from, next) => {
//   store.serviceList = [];
//   yearStore.yearList = [];
//   projectStore.projectList = [];
//   next();
// });

/** **/
</script>

<style lang="scss">
@import "src/css/home.scss";
@import "src/css/userDashboard.scss";
@import "src/css/responsive.scss";

// $
.archive-box {
  opacity: 0.5;
}

// .action-btn {
//   display: none;
// }
// action-btn:hover {
//   display: inline-block;
// }
</style>

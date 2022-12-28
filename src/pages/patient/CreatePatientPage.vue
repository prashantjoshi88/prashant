<template>
  <q-form @submit="onSubmit">
    <div class="home_user_header">
      <h3 class="comman-title">{{ slug ? "Update" : "Create" }} Patient</h3>
    </div>
    <div class="q-pa-md main-wrapper">
      <div class="bg-box">
        <div class="q-mt-lg q-mb-lg">
          <label for="">Select Organizations</label>
          <!-- <q-btn-dropdown
            class="create-user-field-box select_drop_box"
            label="Select Organization"
            outlined
          >
            <q-list
              class="q-pl-none q-pr-none select_drop_list"
              v-for="(item, index) in organization"
              :key="index"
            >
              <q-item clickable v-close-popup @click="onItemClickOrg(item.id)">
                <q-item-section>
                  <q-item-label @click="onItemClickOrg(item.id)">{{
                    item.id + ". " + item.name
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown> -->
          <q-select
            hide-bottom-space
            outlined
            class="create-user-field-box"
            style="min-width: 300px"
            v-model="organizations"
            :options="organizationList"
            :rules="[(val) => val.length != 0 || required(val, 'Organization')]"
          />
          <!-- <q-input
          outlined
          v-model="org_id"
          :dense="dense"
          placeholder="Organizations"
          class="create-user-field-box"
          :rules="[(val) => required(val, 'Organizations')]"
        /> -->
        </div>
        <label for="">Name</label>
        <q-input
          outlined
          v-model="user_name"
          :dense="dense"
          placeholder="Name"
          class="create-user-field-box"
          :rules="[(val) => required(val, 'Name')]"
        />
        <span v-if="!slug">
          <label for="">Email</label>
          <q-input
            outlined
            v-model="email"
            :dense="dense"
            placeholder="Email"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Email'), (val) => isEmail(val)]"
          />
        </span>

        <div v-if="!slug">
          <div class="pass-feild">
            <label for="">Password </label>
            <q-btn label="Generate" @click="generate()" />
          </div>

          <q-input
            outlined
            v-model="password"
            :dense="dense"
            placeholder="Password"
            class="create-user-field-box"
            :rules="[
              (val) => required(val, 'Password'),
              (val) => validatePassword(val),
            ]"
          />
        </div>
        <label for="">Phone Number </label>

        <q-btn
          flat
          padding="none"
          color="primary"
          icon="info"
          class="info_tooltip"
        >
          <q-tooltip
            class="bg-purple text-body2"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            <small>Please Enter 10 Digit Phone Number</small>
          </q-tooltip>
        </q-btn>
        <!-- <q-btn flat icon="la-info-circle" color="primary">
            <q-tooltip
              class="bg-purple text-body2"
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
            >
              Please Enter 10 Digit Phone Number
            </q-tooltip>
          </q-btn> -->
        <q-input
          outlined
          v-model="phone_number"
          :dense="dense"
          prefix="+1"
          placeholder="Phone Number"
          class="create-user-field-box"
          :rules="[(val) => required(val, 'Phone Number')]"
          :error="errors['phone_number'] ? true : false"
          :error-message="serverValidationError(errors, 'phone_number')"
        />
        <span v-if="!slug">
          <label for="">Patient CR</label>
          <q-input
            outlined
            v-model="patient_cr"
            :dense="dense"
            placeholder="Patient CR"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Patient CR')]"
          />
        </span>
      </div>
      <div class="form_comon_btn q-mt-md q-mr-md q-mb-md">
        <q-btn outline color="primary" label="Cancel" @click="cancel" />
        <q-btn color="primary" type="submit" label="Submit" class="q-ml-md" />
      </div>
    </div>
  </q-form>
</template>
<script setup>
import { copyToClipboard } from "quasar";
import { ref, computed, onMounted, defineAsyncComponent } from "vue";
import { ROLE, PERMISSION, PATIENT } from "src/apis/constant";
import { patientStore } from "src/stores/patient";
import notification from "src/boot/notification";
import { useRoute, useRouter } from "vue-router";
import { Loading, QSpinnerGears } from "quasar";
import useServerError from "src/composables/useServerError";

import * as RandExp from "randexp";

import api from "src/apis/index";
import { useAuthStore } from "src/stores/auth";
const tableComponent = defineAsyncComponent(() =>
  import("src/components/table-component")
);
const { errors, serverValidationError } = useServerError();

const tab = ref("group");
const storePatient = patientStore();
const router = useRouter();
const route = useRoute();
const isIdle = ref(false);
const authStore = useAuthStore();
const isSuperPatient = computed(() => {
  return authStore.isSuperPatient;
});
const groupColumns = [
  {
    name: "group",
    align: "center",
    label: "Group",
    field: (row) => row.name,
    format: (val) => `${val}`,
    required: true,
    //sortable: true,
  },
  {
    name: "attached_policies",
    align: "center",
    label: "Attached Policies",
    field: "attached_policies",
    //sortable: true,
  },
];

const policyColumns = [
  {
    name: "id",
    label: "NO.",
    field: "id",
    //sortable: true,
  },

  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    //sortable: true,
  },

  {
    name: "policies",
    align: "center",
    label: "Policies",
    field: (row) => row.policy,
    format: (val) => {
      let h = "";
      for (let [key, value] of Object.entries(val)) {
        for (var k of Object.keys(value)) {
          h += `${k} - ${value[k]}`;
        }
      }
      return h;
    },
    //sortable: true,
  },
];

const userColumns = [
  {
    name: "user_name",
    required: true,
    label: "Patient Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    //sortable: true,
  },
  {
    name: "email",
    align: "center",
    label: "Email",
    field: (row) => row.email,
    format: (val) => `${val}`,
    //sortable: true,
  },
];

const tableRef = ref(null);
const selected = ref([]);
const filter = ref("");
const characters = ref("a-z,A-Z,0-9,#");
const size = ref(12);
// const org_id = ref();
const user_name = ref("");
const email = ref("");
const password = ref("");
const phone_number = ref("");
const patient_cr = ref("");
const organizations = ref([]);
storePatient.fetchOrganization();
const organizationList = computed(() => {
  return storePatient.organizationList;
});

function generate() {
  const s1 = new RandExp(/[A-Z]{1}/gm).gen();
  const s2 = new RandExp(/[a-z]{3,5}/gm).gen();
  const s3 = new RandExp(/[@#$%^&*!]{1}/gm).gen();
  const s4 = new RandExp(/[0-9]{3,5}/gm).gen();

  // let charactersArray = characters.value.split(",");
  // let CharacterSet = "";
  // let pass = "";

  // if (charactersArray.indexOf("A-Z") >= 0) {
  //   CharacterSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // }
  // if (charactersArray.indexOf("a-z") >= 0) {
  //   CharacterSet += "abcdefghijklmnopqrstuvwxyz";
  // }
  // if (charactersArray.indexOf("#") >= 0) {
  //   CharacterSet += "!@#$%^&*";
  // }
  // if (charactersArray.indexOf("0-9") >= 0) {
  //   CharacterSet += "0123456789";
  // }

  // for (let i = 0; i < size.value; i++) {
  //   pass += CharacterSet.charAt(
  //     Math.floor(Math.random() * CharacterSet.length)
  //   );
  // }
  password.value = s1 + s2 + s3 + s4;
  copyToClipboard(password.value);
}

function onSelection(rows, added) {
  if (added) {
    rows.forEach((item, index) => {
      selected.value.push(item.id);
    });
  } else {
    rows.forEach((item) => {
      selected.value.forEach((items, index, object) => {
        if (items == item.id) {
          object.splice(index, 1);
        }
      });
    });
  }
}

// function onItemClickOrg(id) {
//   org_id.value = id;
// }

function cancel() {
  history.go(-1);
}

const slug = ref(null);
const edit_id = ref(null);
const selectedGroups = ref([]);
// Check if current route is edit
if (route.name == "edit-patient") {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  slug.value = route.params.slug;

  api
    .get(api.resolveApiUrl(PATIENT.SHOW, { id: slug.value }))
    .then((res) => {
      if (res.success == true) {
        console.log(res.data);
        edit_id.value = res.data.id;
        user_name.value = res.data.name;
        organizations.value = {
          value: res.data.org_id,
          label: get_org(res.data.org_id),
        };
        email.value = res.data.email;
        if (res.data.phone_number.startsWith("+1")) {
          phone_number.value = res.data.phone_number.split("+1").pop();
        } else {
          phone_number.value = res.data.phone_number;
        }
        patient_cr.value = res.data.patient_cr;

        // if (res.data.policies.length != 0) {
        //   selectedGroups.value = res.data.policies;
        //   tab.value = "policy";
        // } else if (res.data.users.length != 0) {
        //   selectedGroups.value = res.data.users;
        //   tab.value = "user";
        // } else {
        //   selectedGroups.value = res.data.groups;
        //   tab.value = "group";
        // }
        // onSelection(selectedGroups.value, true);
        Loading.hide();
      } else if (res.success == false) {
        notification.error(res.message);
        Loading.hide();
      }
    })

    .finally(() => {
      isIdle.value = true;
      Loading.hide();
    });
}

onMounted(() => {
  if (route.name !== "edit-patient") {
    isIdle.value = true;
  }
});

function get_org(id) {
  return organizationList.value.find((item) => item.value === id)?.label;
}

function onSubmit() {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  const data = {
    org_id: organizations.value.value,
    name: user_name.value,
    email: email.value,
    phone_number: phone_number.value,
    patient_cr: patient_cr.value,
    // isSuperAdmin: true,
  };
  // if (tab.value == "group") {
  //   data.groups = selected.value;
  // } else if (tab.value == "user") {
  //   data.user = selected.value;
  // } else if (tab.value == "policy") {
  //   data.policies = selected.value;
  // }
  if (password.value) {
    data.password = password.value;
  }

  if (route.name == "edit-patient") {
    storePatient
      .updatePatient(data, edit_id.value)
      .then((res) => {
        if (res.success == true) {
          notification.success(
            res.message ? res.message : "Patient Edited Successfully !"
          );
          router.push({ name: "patient-dashboard" });
          Loading.hide();
        } else if (res.success == false) {
          notification.error(res.message);
          Loading.hide();
        }
      })
      .catch((error) => {
        console.log(error.response.data.errors);
        if (error.response) {
          Loading.hide();
          errors.value = error.response.data.errors;
          errors.value.forEach((item) => {
            notification.error(item.message);
          });
        }
      })
      .finally(() => {
        Loading.hide();
      });
  } else {
    storePatient
      .saveNewPatient(data)
      .then((res) => {
        console.log(data);
        if (res.success == true) {
          notification.success(
            res.message ? res.message : "Patient Created Successfully !"
          );
          router.push({ name: "patient-dashboard" });
          Loading.hide();
        } else if (res.success == false) {
          notification.error(res.message);
          Loading.hide();
        }
      })
      .catch((error) => {
        console.log(error.response.data.errors);
        if (error.response) {
          Loading.hide();

          error.response.data.errors.forEach((item) => {
            notification.error(item.message);
            errors.value = item.message;
          });
        }
      })
      .finally(() => {
        Loading.hide();
      });
  }
}
</script>

<style lang="scss">
// $
.pass-feild {
  @include hr-vr-center-between;
}
.add_option_gruop {
  @include box-vr-center;
  .add_user_grup_btn {
    // background: #d9d9d9;
    width: 33.33%;
    height: $value-86;
    margin-right: $percentage-2;
    padding-right: $value-10;
    @include hr-vr-center;
    a {
      text-decoration: none;
      font-size: $value-20;
      margin-left: $value-10;
      color: #000000;
      font-weight: map-get($font-weights, medium);
    }
    &:last-child {
      margin-right: 0;
    }
  }
  .icon-btn {
    font-size: $value-50;
  }
}
h3.comman-title {
  font-size: $value-25;
  font-weight: map-get($font-weights, medium);
  margin-left: $value-33;
  padding-top: $value-20;
}
.create_user-text {
  p {
    font-size: $value-16;
    font-weight: map-get($font-weights, medium);
  }
}
.q-table__card {
  box-shadow: none;
}
.main-wrapper {
  .create-user-field-box {
    .q-field__control {
      height: $value-45;
    }
  }
}

.q-field--auto-height .q-field__control,
.q-field--auto-height .q-field__native {
  min-height: $value-45;
}

.select_drop_box {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.24);
  min-height: 45px;
  .q-btn__content {
    justify-content: space-between;
  }
}
.q-pr-none {
  padding-right: 0 !important;
}
.q-pl-none {
  padding-left: 0 !important;
}
.select_drop_list {
  .q-item {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .q-item__label {
    padding: 8px 15px;
  }
}
.select_drop_list {
  .q-item__label:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>

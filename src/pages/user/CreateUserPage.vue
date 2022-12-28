<template>
  <q-form @submit="onSubmit">
    <div class="home_user_header">
      <h3 class="comman-title">{{ slug ? "Update" : "Create" }} User</h3>
    </div>
    <div class="q-pa-md main-wrapper">
      <div class="bg-box">
        <label for="">Name</label>
        <q-input
          outlined
          v-model="user_name"
          :dense="dense"
          placeholder="Name"
          class="create-user-field-box"
          :rules="[(val) => required(val, 'Name')]"
        />
        <div class="q-mt-lg" v-if="!slug">
          <label for="">Email</label>
          <q-input
            outlined
            v-model="email"
            :dense="dense"
            placeholder="Email"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Email'), (val) => isEmail(val)]"
          />
        </div>
        <div v-if="!slug" class="q-mt-lg">
          <div class="pass-feild">
            <label for="">Password </label>
            <q-btn label="Generate" @click="generate()" />
          </div>
          <div>
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
        </div>
        <!-- <div class="custom-tabel-box align-left q-mt-md">
          <table-component
            :apiUrl="ROLE.LIST"
            title="ROLE"
            :columns="groupColumns"
            selectionType="multiple"
            rowKey="id"
            createUrl="/role/create"
            @selected="onSelection"
            :selectedItem="selectedGroups"
          />
        </div> -->
        <!-- <div class="add_option_gruop q-mt-xl">
          <q-card class="user-card-width">
            <q-tabs v-model="tab" narrow-indicator class="create-user-tab">
              <q-tab name="group">
                <div class="add_user_grup_btn">
                  <div class="icon-btn">
                    <i class="las la-user-friends"></i>
                  </div>
                  <div>Add user to Role</div>
                </div>
              </q-tab>
              <q-tab name="user">
                <div class="add_user_grup_btn active-btn">
                  <div class="icon-btn">
                    <i class="las la-user"></i>
                  </div>
                  <div>Copy permissions from existing user</div>
                </div>
              </q-tab>
              <q-tab name="policy">
                <div class="add_user_grup_btn">
                  <div class="icon-btn">
                    <i class="las la-file-alt"></i>
                  </div>
                  <div>Attach existing policies directly</div>
                </div>
              </q-tab>
            </q-tabs>

            <q-separator />

            <q-tab-panels v-if="isIdle" v-model="tab" animated>
              <q-tab-panel name="group">
                <div class="custom-tabel-box align-left q-mt-md">
                  <table-component
                    :apiUrl="ROLE.LIST"
                    title="ROLE"
                    :columns="groupColumns"
                    selectionType="multiple"
                    rowKey="id"
                    createUrl="/group/create"
                    @selected="onSelection"
                    :selectedItem="selectedGroups"
                  />
                </div>
              </q-tab-panel>

              <q-tab-panel name="user">
                <div class="create_user-text q-mt-lg">
                  <p>
                    Select an existing user from which to copy policies and
                    group membership.
                  </p>
                  <h5>Copy permissions from existing user</h5>
                </div>
                <div class="custom-tabel-box align-left q-mt-md">
                  <table-component
                    :apiUrl="USER.LIST"
                    title="Existing User"
                    :columns="userColumns"
                    selectionType="single"
                    rowKey="id"
                    createUrl="/user/create"
                    @selected="onSelection"
                    :selectedItem="selectedGroups"
                  />
                </div>
              </q-tab-panel>

              <q-tab-panel name="policy">
                <div class="custom-tabel-box align-left q-mt-md">
                  <table-component
                    :apiUrl="PERMISSION.LIST"
                    title="Attached Policies"
                    :columns="policyColumns"
                    selectionType="multiple"
                    rowKey="id"
                    createUrl="/policy/create"
                    @selected="onSelection"
                    :selectedItem="selectedGroups"
                  />
                </div>
              </q-tab-panel>
            </q-tab-panels>
            <div class="form_comon_btn q-mt-md q-mr-md q-mb-md">
              <q-btn outline color="primary" label="Cancel" />
              <q-btn
                color="primary"
                type="submit"
                label="Submit"
                class="q-ml-md"
              />
            </div>
          </q-card>
        </div> -->
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
import { ROLE, PERMISSION, USER } from "src/apis/constant";
import { userStore } from "src/stores/users";
import notification from "src/boot/notification";
import { Loading, QSpinnerGears } from "quasar";
import * as RandExp from "randexp";

import { useRoute, useRouter } from "vue-router";
import api from "src/apis/index";
import { useAuthStore } from "src/stores/auth";
const tableComponent = defineAsyncComponent(() =>
  import("src/components/table-component")
);

const tab = ref("group");
const storeUser = userStore();
const router = useRouter();
const route = useRoute();
const isIdle = ref(false);
const authStore = useAuthStore();
const isSuperUser = computed(() => {
  return authStore.isSuperUser;
});
const groupColumns = [
  {
    name: "role",
    align: "center",
    label: "Role",
    field: (row) => row.name,
    format: (val) => `${val}`,
    required: true,
    //sortable: true,
  },
  {
    name: "attached_permission",
    align: "center",
    label: "Attached Permission",
    field: "attached_Permission",
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
    label: "User Name",
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
const user_name = ref("");
const email = ref("");
const password = ref("");

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

const slug = ref(null);
const edit_id = ref(null);
const selectedGroups = ref([]);
// Check if current route is edit
if (route.name == "edit-user") {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  slug.value = route.params.slug;

  api
    .get(api.resolveApiUrl(USER.SHOW, { id: slug.value }))
    .then((res) => {
      if (res.success == true) {
        console.log(res.data);
        edit_id.value = res.data.id;
        user_name.value = res.data.name;
        email.value = res.data.email;

        if (res.data.policies.length != 0) {
          selectedGroups.value = res.data.policies;
          tab.value = "policy";
        } else if (res.data.users.length != 0) {
          selectedGroups.value = res.data.users;
          tab.value = "user";
        } else {
          selectedGroups.value = res.data.groups;
          tab.value = "group";
        }
        onSelection(selectedGroups.value, true);
        Loading.hide();
      } else if (res.success == false) {
        notification.error(res.message);
        Loading.hide();
      }
    })
    .catch((error) => {
      console.log(error);
      Loading.hide();
    })
    .finally(() => {
      isIdle.value = true;
      Loading.hide();
    });
}

onMounted(() => {
  if (route.name !== "edit-user") {
    isIdle.value = true;
  }
});

function cancel() {
  history.go(-1);
}

function onSubmit() {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  const data = {
    name: user_name.value,
    email: email.value,

    isSuperAdmin: true,
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

  if (route.name == "edit-user") {
    storeUser
      .updateUser(data, edit_id.value)
      .then((res) => {
        if (res.success == true) {
          notification.success(
            res.message ? res.message : "User Edited Successfully !"
          );
          router.push({ name: "user-dashboard" });
          Loading.hide();
        } else if (res.success == false) {
          notification.error(res.message);
          Loading.hide();
        }
      })
      .finally(() => {
        Loading.hide();
      });
  } else {
    storeUser
      .saveNewUser(data)
      .then((res) => {
        console.log(data);
        if (res.success == true) {
          notification.success(
            res.message ? res.message : "User Created Successfully !"
          );
          router.push({ name: "user-dashboard" });
          Loading.hide();
        } else if (res.success == false) {
          notification.error(res.message);
          Loading.hide();
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
</style>

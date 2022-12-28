<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">{{ $q.lang.stress.management }}</h3>
    </div>
    <div class="q-pa-md main-wrapper">
      <div class="custom-tabel-box">
        <table-component
          ref="tableRefresh"
          :apiUrl="STRESS_MANAGEMENT.LIST"
          :title="$q.lang.stress.management"
          :columns="columns"
          rowKey="id"
          createUrl="/stressManagement/create"
          @selected="onSelection"
          @delete="deleteItem"
          @edit="editItem"
          @view="showItem"
        />
      </div>
    </div>
  </div>
  <q-dialog v-model="showDialog">
    <q-card class="my-card comman-close-popup poli-card-width">
      <div class="close-top-posi">
        <i class="las la-times" v-close-popup></i>
      </div>
      <q-card-section class="q-pa-sm q-pl-md">
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">Name : {{ showItemData.name }}</div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm q-pl-md">
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Platform : {{ get_platform(showItemData.platform_master_id) }}
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm q-pl-md">
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Category : {{ get_category(showItemData.smm_category_id) }}
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm q-pl-md">
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">URL : {{ showItemData.url }}</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-none newpolicy-popup">
        <!-- <q-item>
          <q-item-section>
            <q-item-label
              ><div class="col text-h6 ellipsis">
                {{ showItemData.category_icon }}
              </div></q-item-label
            >
          </q-item-section>
        </q-item> -->
        <!-- <q-item>
          <q-badge
            v-if="showItemData.groups.length != 0"
            color="primary"
            text-color="white"
            label="Groups"
          /><br />
          <q-item-section v-for="item in showItemData.groups" :key="item">
            <q-item-label class="policy-listing q-pb-sm">
              <div class="poli-label">{{ item.name }}</div>
            </q-item-label>
          </q-item-section>
        </q-item> -->
        <!-- <q-item>
          <q-badge
            v-if="showItemData.policies.length != 0"
            color="primary"
            text-color="white"
            label="Policies"
          /><br />
          <q-item-section v-for="item in showItemData.policies" :key="item">
            <q-item-label class="policy-listing q-pb-sm">
              <div class="poli-label">
                {{ item.name }}
                <q-item-section
                  v-for="(value, keys) in item.policy"
                  :key="keys"
                >
                  <span v-for="key in Object.keys(value)" :key="key">
                    <q-item-label class="policy-listing q-pb-sm">
                      <q-badge color="blue q-mr-md">
                        <div class="value-text-policy">{{ key }}</div>
                      </q-badge>

                      <div class="poli-label">{{ value[key] }}</div>
                    </q-item-label>
                  </span>
                </q-item-section>
              </div>
            </q-item-label>
          </q-item-section>
        </q-item> -->
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { STRESS_MANAGEMENT } from "src/apis/constant";
import { defineAsyncComponent, ref, computed } from "vue";
import { stressManagementStore } from "src/stores/stressManagement";
import { platformMasterStore } from "src/stores/platformMaster";
import { stressCategoryStore } from "src/stores/stressCategory";
import notification from "src/boot/notification";
import { useRoute, useRouter } from "vue-router";
import { Loading, QSpinnerGears } from "quasar";

const router = useRouter();
const store = stressManagementStore();
const tableComponent = defineAsyncComponent(() =>
  import("src/components/table-component")
);

const platformStore = platformMasterStore();
const categoryStore = stressCategoryStore();

platformStore.fetchPlatformMasterList();
categoryStore.fetchStressCategoryList();

const platformList = computed(() => {
  const list = ref([]);
  platformStore.platformMasterList.forEach((item) => {
    console.log(item.id);
    list.value.push({
      label: item.name,
      value: item.id,
    });
  });
  return list.value;
});

const categoryList = computed(() => {
  const list = ref([]);
  categoryStore.stressCategoryList.forEach((item) => {
    console.log(item.id);
    list.value.push({
      label: item.name,
      value: item.id,
    });
  });
  return list.value;
});

function get_platform(id) {
  return platformList.value.find((item) => item.value === id)?.label;
}
function get_category(id) {
  return categoryList.value.find((item) => item.value === id)?.label;
}

const showDialog = ref(false);
const showItemData = ref({});
const tableRefresh = ref(null);

const columns = [
  {
    name: "id",
    label: "NO.",
    field: "index",
    //sortable: true,
    align: "left",
  },
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => (row.name ? row.name : ""),
    format: (val) => `${val}`,
    // //sortable: true,
  },
  // {
  //   name: "platform",
  //   required: true,
  //   label: "Platform",
  //   align: "left",
  //   field: (row) => get_platform(row.platform_master_id),
  //   format: (val) => `${val}`,
  //   // //sortable: true,
  // },

  {
    name: "image",
    required: true,
    label: "Platform",
    align: "left",
    field: (row) => (row.platform.icon ? row.platform.icon : ""),
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "category",
    required: true,
    label: "Category",
    align: "left",
    field: (row) => get_category(row.smm_category_id),
    format: (val) => `${val}`,
    // //sortable: true,
  },
  // {
  //   name: "image",
  //   required: true,
  //   label: "Image",
  //   align: "left",
  //   field: (row) => row.image,
  //   format: (val) => `${val}`,
  //   // //sortable: true,
  // },
  {
    name: "url",
    required: true,
    label: "URL",
    align: "left",
    field: (row) => row.url,
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
  },
];

function deleteItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .deleteStressManagement(item.id)
    .then((res) => {
      if (res.success == true) {
        tableRefresh.value.refresh().then(() => {
          notification.success(res.message);
          Loading.hide();
        });
      } else if (res.success == false) {
        notification.error(res.message);
        Loading.hide();
      }
    })
    .finally(() => {
      Loading.hide();
    });
}

function editItem(item) {
  router.push({
    name: "edit-stressManagement",
    params: { slug: item.id },
  });
}

function showItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .fetchStressManagement(item.id)
    .then((res) => {
      if (res.success == true) {
        showItemData.value = res.data;
        showDialog.value = true;
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
</script>

<style lang="scss">
//$
h3.comman-title {
  font-size: $value-25;
  font-weight: map-get($font-weights, medium);
  margin-left: $value-33;
  padding-top: $value-20;
}
</style>

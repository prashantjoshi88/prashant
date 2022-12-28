<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">{{ $q.lang.wellness.tips }}</h3>
    </div>
    <div class="q-pa-md main-wrapper">
      <div class="custom-tabel-box">
        <table-component
          ref="tableRefresh"
          :apiUrl="WELLNESS_TIPS.LIST"
          :title="$q.lang.wellness.tips"
          :columns="columns"
          rowKey="id"
          createUrl="/wellnessTips/create"
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
          <div class="col text-h6 ellipsis">Tip : {{ showItemData.tips }}</div>
        </div>
      </q-card-section>
      <!-- <q-card-section class="q-pa-sm q-pl-md">
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Category :
            {{ showItemData?.category.title }}
          </div>
        </div>
      </q-card-section> -->
    </q-card>
  </q-dialog>
</template>
<script setup>
import { WELLNESS_TIPS } from "src/apis/constant";
import { defineAsyncComponent, ref, computed } from "vue";
import { wellnessTipsStore } from "src/stores/wellnessTips";
import { wellnessCatStore } from "src/stores/wellnessCategory";

import notification from "src/boot/notification";
import { useRoute, useRouter } from "vue-router";
import { Loading, QSpinnerGears } from "quasar";

const router = useRouter();
const store = wellnessTipsStore();
const tableComponent = defineAsyncComponent(() =>
  import("src/components/table-component")
);

const categoryStore = wellnessCatStore();
categoryStore.fetchWellnessCatList();

const categoryList = computed(() => {
  const list = ref([]);
  categoryStore.wellnessCatList.forEach((item) => {
    console.log(item.id);
    list.value.push({
      label: item.title,
      value: item.id,
    });
  });
  return list.value;
});

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
    // //sortable: true,
    align: "left",
  },
  {
    name: "tips",
    required: true,
    label: "Tips",
    align: "left",
    field: (row) => row.tips,
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "category_icon",
    required: true,
    label: "Tips Category",
    align: "left",
    field: (row) => row.category.title,
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
    .deleteWellnessTips(item.id)
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
    name: "edit-wellnessTips",
    params: { slug: item.id },
  });
}

function showItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .fetchWellnessTips(item.id)
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

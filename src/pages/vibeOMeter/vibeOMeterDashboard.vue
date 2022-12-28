<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">{{ $q.lang.vibe.title }}</h3>
    </div>
    <div class="q-pa-md main-wrapper">
      <div class="custom-tabel-box">
        <table-component
          ref="tableRefresh"
          :apiUrl="VIBE.LIST"
          title="Vibe"
          :columns="columns"
          rowKey="id"
          createUrl="/vibe-o-meter/create"
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
          <div class="col text-h6 ellipsis">{{ showItemData.title }}</div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm qimg_remove_extra">
        <q-img :src="showItemData.image" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { VIBE } from "src/apis/constant";
import { defineAsyncComponent, ref } from "vue";
import { vibeStore } from "src/stores/vibeOMeter";
import notification from "src/boot/notification";
import { useRoute, useRouter } from "vue-router";
import { Loading, QSpinnerGears } from "quasar";

const router = useRouter();
const store = vibeStore();
const tableComponent = defineAsyncComponent(() =>
  import("src/components/table-component")
);

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
    name: "answer",
    required: true,
    label: "Answer",
    align: "left",
    field: (row) => row.answer,
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "message",
    required: true,
    label: "Message",
    align: "left",
    field: (row) => row.message,
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "point",
    required: true,
    label: "Points",
    align: "left",
    field: (row) => row.points,
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "image",
    required: true,
    label: "Icon",
    align: "left",
    field: (row) => row.icon ?? null,
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "emoji",
    required: true,
    label: "Emoji",
    align: "left",
    field: (row) => row.emoji ?? null,
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
    .deleteVibe(item.id)
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
    name: "edit-vibeOMeter",
    params: { slug: item.id },
  });
}

function showItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .fetchVibe(item.id)
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

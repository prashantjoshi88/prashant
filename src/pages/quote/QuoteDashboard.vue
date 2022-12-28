<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">{{ $q.lang.quote.title }}</h3>
    </div>
    <div class="q-pa-md main-wrapper">
      <div class="custom-tabel-box">
        <table-component
          ref="tableRefresh"
          :apiUrl="QUOTE.LIST"
          title="Quotes"
          :columns="columns"
          rowKey="id"
          createUrl="/quote/create"
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
          <div class="col text-h6 ellipsis">{{ showItemData.quote_text }}</div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm qimg_remove_extra">
        <q-img :src="showItemData.quote_img" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { QUOTE } from "src/apis/constant";
import { defineAsyncComponent, ref } from "vue";
import { quoteStore } from "src/stores/quote";
import notification from "src/boot/notification";
import { useRoute, useRouter } from "vue-router";
import { Loading, QSpinnerGears } from "quasar";

const router = useRouter();
const store = quoteStore();
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
    name: "Quote",
    required: true,
    label: "Quote",
    align: "left",
    field: (row) => (row.quote_text == null ? "" : row.quote_text),
    format: (val) => `${val}`,
    // //sortable: true,
  },
  {
    name: "image",
    required: true,
    label: "Image",
    align: "left",
    field: (row) => row.quote_img,
    // format: (val) => `<q-img :src="${val}"/>`,
    HTMLImageElement: (val) => `${val}`,
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
    .deleteQuote(item.id)
    .then((res) => {
      if (res.success == true) {
        Loading.hide();
        tableRefresh.value.refresh().then(() => {
          notification.success(res.message);
        });
      } else if (res.success == false) {
        Loading.hide();
        notification.error(res.message);
      }
    })
    .finally(() => {
      Loading.hide();
    });
}

function editItem(item) {
  router.push({
    name: "edit-quote",
    params: { slug: item.id },
  });
}

function showItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .fetchQuote(item.id)
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

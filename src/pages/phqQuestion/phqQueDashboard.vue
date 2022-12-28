<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">{{ $q.lang.phqQuestion.title }}</h3>
    </div>
    <div class="q-pa-md main-wrapper">
      <div class="custom-tabel-box">
        <table-component
          ref="tableRefresh"
          :apiUrl="PHQ_QUESTION.LIST"
          title="Phq_Question"
          :columns="columns"
          rowKey="id"
          createUrl="/phq-9-problems/create"
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
import { PHQ_QUESTION } from "src/apis/constant";
import { defineAsyncComponent, ref } from "vue";
import { phq_QuestionStore } from "src/stores/phqQuestion";
import notification from "src/boot/notification";
import { useRoute, useRouter } from "vue-router";
import { Loading, QSpinnerGears } from "quasar";

const router = useRouter();
const store = phq_QuestionStore();
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
    name: "name",
    required: true,
    label: "Problems",
    align: "left",
    field: (row) => row.problems,
    format: (val) => `${val}`,
    // //sortable: true,
  },
  // {
  //   name: "answer",
  //   required: true,
  //   label: "Answer",
  //   align: "left",
  //   field: (row) => row.answer,
  //   format: (val) => `${val}`,
  //   // //sortable: true,
  // },
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
    .deletePhq_Question(item.id)
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
    name: "edit-phq_Question",
    params: { slug: item.id },
  });
}

function showItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .fetchPhq_Question(item.id)
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

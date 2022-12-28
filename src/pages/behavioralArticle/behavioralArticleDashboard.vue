<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">{{ $q.lang.behavioral.article }}</h3>
    </div>
    <div class="q-pa-md main-wrapper">
      <div class="custom-tabel-box">
        <table-component
          ref="tableRefresh"
          :apiUrl="BEHAVIORAL_ARTICLE.LIST"
          :title="$q.lang.behavioral.article"
          :columns="columns"
          rowKey="id"
          createUrl="/behavioral-article/create"
          @selected="onSelection"
          @delete="deleteItem"
          @edit="editItem"
          @view="showItem"
        />
      </div>
    </div>
  </div>
  <q-dialog v-model="showDialog" class="popup_size_medium">
    <q-card class="my-card comman-close-popup poli-card-width">
      <q-card-section class="row items-center q-pb-none q-mb-md">
        <div class="text-h6">Behavioral Article</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
        <!-- <div class="close-top-posi">
          <i class="las la-times" v-close-popup></i>
        </div> -->
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-sm q-pl-md">
        <div class="row no-wrap items-center">
          <div class="col text-h6">{{ showItemData.title }}</div>
        </div>
      </q-card-section>
      <q-card-section
        class="q-pa-sm q-pl-md qimg_remove_extra popup_main_thumb"
      >
        <img :src="showItemData.image" />
      </q-card-section>

      <q-card-section class="q-pa-sm q-pl-md">
        <div class="row no-wrap items-center">
          <div class="col">
            {{ showItemData.short_description }}
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm q-pl-md">
        <div class="row no-wrap items-center">
          <div class="col text-h6" v-html="showItemData.long_description" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { BEHAVIORAL_ARTICLE } from "src/apis/constant";
import { defineAsyncComponent, ref, computed } from "vue";
import { behavioralArticleStore } from "src/stores/behavioralArticle";
import { behavioralCategoryStore } from "src/stores/behavioralCategory";
import { Loading, QSpinnerGears } from "quasar";

import notification from "src/boot/notification";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const store = behavioralArticleStore();
const tableComponent = defineAsyncComponent(() =>
  import("src/components/table-component")
);

const categoryStore = behavioralCategoryStore();
categoryStore.fetchBehavioralCategoryList();

const categoryList = computed(() => {
  const list = ref([]);
  categoryStore.behavioralCategoryList.forEach((item) => {
    console.log(item);
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
    //sortable: true,
    align: "left",
  },
  {
    name: "name",
    required: true,
    label: "Title",
    align: "left",
    field: (row) => row.title,
    format: (val) => `${val}`,
    //sortable: true,
  },
  {
    name: "short_description",
    required: true,
    label: "Short Description",
    align: "left",
    field: (row) => row.short_description,
    format: (val) => `${val}`,
    //sortable: true,
  },
  {
    name: "category_icon",
    required: true,
    label: "Category",
    align: "left",
    field: (row) => row.category.name,
    format: (val) => `${val}`,
    //sortable: true,
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
    .deleteBehavioralArticle(item.id)
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
    name: "edit-behavioralArticle",
    params: { slug: item.id },
  });
}

function showItem(item) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  store
    .fetchBehavioralArticle(item.id)
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

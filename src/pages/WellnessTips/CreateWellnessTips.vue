<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">
        {{ slug ? "Update" : "Create" }} Wellness Tips
      </h3>
    </div>
    <q-form @submit.prevent="onSubmit" ref="form">
      <div class="q-pa-md main-wrapper">
        <div class="bg-box">
          <div class="q-mb-md">
            <label for="">Select Wellness tips Category</label>
            <q-select
              hide-bottom-space
              outlined
              class="create-user-field-box"
              style="min-width: 300px"
              v-model="category"
              :options="categoryList"
              :rules="[(val) => val.length != 0 || required(val, 'Category')]"
            />
          </div>
          <label for="">Tips</label>
          <q-input
            outlined
            v-model="tips"
            :dense="dense"
            placeholder="Tip"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Tip')]"
          />
          <!-- <label for="">Image</label> -->
          <div>
            <!-- <q-file
              v-model="image"
              label="Pick one Image"
              filled
              style="max-width: 300px"
              @update:model-value="handleUpload()"
            ></q-file> -->
            <!-- <q-input
              v-model="image"
              type="file"
              @update:model-value="handleUpload()"
            /> -->
          </div>
          <!-- <div>
            <q-img
              :src="imageUrl"
              spinner-color="white"
              style="height: 150px; max-width: 450px"
            ></q-img>
          </div> -->
        </div>
        <div class="col-md-4 text-right">
          <div class="form_comon_btn">
            <q-btn
              type="reset"
              outline
              color="primary"
              class="btn-create-policy"
              :label="$q.lang.button.cancel"
              @click="cancel"
            />
            <q-btn
              color="primary"
              type="submit"
              label="Submit"
              class="q-ml-md"
            />
          </div>
        </div>
      </div>
    </q-form>
  </div>
</template>
<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { wellnessTipsStore } from "src/stores/wellnessTips";
import { wellnessCatStore } from "src/stores/wellnessCategory";

import { useRoute, useRouter } from "vue-router";
import api from "src/apis/index";
import { WELLNESS_TIPS } from "src/apis/constant";
import { computed } from "vue";
import { Loading, Notify, QSpinnerGears } from "quasar";

const router = useRouter();
const route = useRoute();
const store = wellnessTipsStore();
const tips = ref("");
const categoryStore = wellnessCatStore();
categoryStore.fetchWellnessCatList();

const slug = ref(null);
const edit_id = ref(null);

const category = ref([]);

// const category = computed(() => {
//   return categoryStore.wellnessCatList;
// });

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

const image = ref(null);
const imageUrl = ref("");
const handleUpload = () => {
  if (image.value) {
    if (image.value[0].size < 2097152) {
      var blob = new Blob(image.value);
      image.value = URL.createObjectURL(blob);
    } else {
      image.value = null;
      Notify.create({
        type: "negative",
        message: "Max Image Size is 2 MB",
      });
    }
  }
};

function cancel() {
  history.go(-1);
}

function get_category(id) {
  return categoryList.value.find((item) => item.value === id)?.label;
}

if (route.name == "edit-wellnessTips") {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  slug.value = route.params.slug;
  api
    .get(api.resolveApiUrl(WELLNESS_TIPS.SHOW, { id: slug.value }))
    .then((res) => {
      if (res.success == true) {
        console.log(res.data);
        edit_id.value = res.data.id;
        tips.value = res.data.tips;
        category.value = {
          value: res.data.wt_category_id,
          label: get_category(res.data.wt_category_id),
        };
        Loading.hide();

        // image.value = res.data.category_icon;
      }
    })
    .catch((error) => {
      console.log(error);
      Loading.hide();
    })
    .finally(() => {
      Loading.hide();
    });
}

function onSubmit() {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  const postData = new FormData();
  postData.append("category_id", category.value.value);
  postData.append("tips", tips.value);

  if (route.name == "edit-wellnessTips") {
    store
      .updateWellnessTips(postData, edit_id.value)
      .then((res) => {
        if (res.success) router.push({ name: "wellnessTips-dashboard" });
        else {
          notification.error(res.message);
          Loading.hide();
        }
      })
      .finally(() => {
        Loading.hide();
      });
  } else {
    store
      .saveNewWellnessTips(postData)
      .then((res) => {
        if (res.success) router.push({ name: "wellnessTips-dashboard" });
        else {
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
//$
h3.comman-title {
  font-size: $value-25;
  font-weight: map-get($font-weights, medium);
  margin-left: $value-33;
  padding-top: $value-20;
}
</style>

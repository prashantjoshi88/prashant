<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">
        {{ slug ? "Update" : "Create" }} Stress Management
      </h3>
    </div>
    <q-form @submit.prevent="onSubmit" ref="form">
      <div class="q-pa-md main-wrapper">
        <div class="bg-box">
          <label for="">Select Category</label>
          <q-select
            outlined
            class="create-user-field-box"
            style="min-width: 300px"
            v-model="category"
            :options="categoryList"
            :rules="[(val) => val.length != 0 || required(val, 'Category')]"
          />

          <!-- IF COPING SKILL  -->
          <span v-if="category.value == 1">
            <label for="">Image</label>
            <div>
              <q-input
                v-if="image == null"
                v-model="image"
                type="file"
                accept="image/*"
                :rules="[(val) => required(val, 'Image')]"
                @update:model-value="handleUpload()"
              />
            </div>
            <div v-if="image != null" class="image_icon_box">
              <img :src="image" spinner-color="white" />
              <i class="la la-trash" @click="image = null"></i>
            </div>
          </span>
          <span v-else>
            <label for="">Name</label>
            <q-input
              outlined
              v-model="name"
              :dense="dense"
              placeholder="Name"
              class="create-user-field-box"
              :rules="[(val) => required(val, 'Name')]"
            />
            <label for="">Select Platform</label>
            <q-select
              outlined
              class="create-user-field-box"
              style="min-width: 300px"
              v-model="platform"
              :options="platformList"
              :rules="[(val) => val.length != 0 || required(val, 'Platform')]"
            />
            <label for="">URL</label>
            <q-input
              outlined
              v-model="url"
              :dense="dense"
              placeholder="URL"
              class="create-user-field-box"
              :rules="[(val) => required(val, 'URL')]"
            />
          </span>
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
import { defineAsyncComponent, onMounted, ref, computed } from "vue";
import { stressManagementStore } from "src/stores/stressManagement";
import { platformMasterStore } from "src/stores/platformMaster";
import { stressCategoryStore } from "src/stores/stressCategory";
import { Loading, Notify, QSpinnerGears } from "quasar";

import { useRoute, useRouter } from "vue-router";
import api from "src/apis/index";
import { STRESS_MANAGEMENT } from "src/apis/constant";

const router = useRouter();
const route = useRoute();
const store = stressManagementStore();
const platformStore = platformMasterStore();
const categoryStore = stressCategoryStore();

const name = ref("");
const url = ref("");
const platform = ref([]);
const category = ref([]);

const slug = ref(null);
const edit_id = ref(null);

platformStore.fetchPlatformMasterList();
categoryStore.fetchStressCategoryList();

function cancel() {
  history.go(-1);
}

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

const image = ref(null);

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

onMounted(() => {
  if (route.name !== "edit-stressManagement") {
    // isIdle.value = true;
  }
});

function get_platform(id) {
  return platformList.value.find((item) => item.value === id)?.label;
}
function get_category(id) {
  return categoryList.value.find((item) => item.value === id)?.label;
}

if (route.name == "edit-stressManagement") {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  slug.value = route.params.slug;
  api
    .get(api.resolveApiUrl(STRESS_MANAGEMENT.SHOW, { id: slug.value }))
    .then((res) => {
      if (res.success == true) {
        console.log(res.data);
        edit_id.value = res.data.id;
        name.value = res.data.name;
        image.value = res.data.image;
        category.value = {
          value: res.data.smm_category_id,
          label: get_category(res.data.smm_category_id),
        };
        platform.value = {
          value: res.data.platform_master_id,
          label: get_platform(res.data.platform_master_id),
        };

        url.value = res.data.url;
        Loading.hide();
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

async function onSubmit() {
  const postData = new FormData();

  postData.append("category_id", category.value.value);

  if (image.value == null) {
    postData.append("name", name.value);
    postData.append("platform_id", platform.value.value);
    postData.append("url", url.value);
  }

  if (image.value.startsWith("https://")) {
    postData.append("image", image.value);
  } else {
    const response = await fetch(image.value);
    const blob = await response.blob();
    const newImage = new File([blob], "image.png");
    postData.append("image", newImage, "image.png");
  }

  if (route.name == "edit-stressManagement") {
    store
      .updateStressManagement(postData, edit_id.value)
      .then((res) => {
        if (res.success) router.push({ name: "stressManagement-dashboard" });
        else {
          notification.error(res.message);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  } else {
    store
      .saveNewStressManagement(postData)
      .then((res) => {
        if (res.success) router.push({ name: "stressManagement-dashboard" });
        else {
          notification.error(res.message);
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

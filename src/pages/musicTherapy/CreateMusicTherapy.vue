<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">
        {{ slug ? "Update" : "Create" }} Music as Therapy
      </h3>
    </div>
    <q-form @submit.prevent="onSubmit" ref="form">
      <div class="q-pa-md main-wrapper">
        <div class="bg-box">
          <label for="">Select Platform</label>
          <q-select
            outlined
            class="create-user-field-box"
            style="min-width: 300px"
            v-model="platform"
            :options="platformList"
            :rules="[(val) => val.length != 0 || required(val, 'Platform')]"
          />
          <label for="">Name</label>
          <q-input
            outlined
            v-model="name"
            :dense="dense"
            placeholder="Name"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Name')]"
          />
          <label for="">URL</label>
          <q-input
            outlined
            v-model="url"
            :dense="dense"
            placeholder="URL"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'URL'), (val) => isUrl(val)]"
          />
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
import { musicTherapyStore } from "src/stores/musicTherapy";
import { platformMasterStore } from "src/stores/platformMaster";
import { Loading, QSpinnerGears } from "quasar";

import { useRoute, useRouter } from "vue-router";
import api from "src/apis/index";
import { MUSIC_THERAPY } from "src/apis/constant";

const router = useRouter();
const route = useRoute();
const store = musicTherapyStore();
const platformStore = platformMasterStore();
const name = ref("");
const url = ref("");
const platform = ref([]);

platformStore.fetchPlatformMasterList();
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

const slug = ref(null);
const edit_id = ref(null);

function cancel() {
  history.go(-1);
}
onMounted(() => {
  if (route.name !== "edit-musicTherapy") {
    // isIdle.value = true;
  }
});

if (route.name == "edit-musicTherapy") {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  slug.value = route.params.slug;
  api
    .get(api.resolveApiUrl(MUSIC_THERAPY.SHOW, { id: slug.value }))
    .then((res) => {
      if (res.success == true) {
        console.log(res.data);
        platform.value = {
          value: res.data.platform_master_id,
          label: get_platform(res.data.platform_master_id),
        };
        edit_id.value = res.data.id;
        name.value = res.data.name;
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

function get_platform(id) {
  return platformList.value.find((item) => item.value === id)?.label;
}

function onSubmit() {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  const postData = new FormData();
  postData.append("platform_id", platform.value.value);
  postData.append("name", name.value);
  postData.append("url", url.value);

  if (route.name == "edit-musicTherapy") {
    store
      .updateMusicTherapy(postData, edit_id.value)
      .then((res) => {
        if (res.success) router.push({ name: "musicTherapy-dashboard" });
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
      .saveNewMusicTherapy(postData)
      .then((res) => {
        if (res.success) router.push({ name: "musicTherapy-dashboard" });
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

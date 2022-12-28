<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">
        {{ slug ? "Update" : "Create" }} Stress Management Category
      </h3>
    </div>
    <q-form @submit.prevent="onSubmit" ref="form">
      <div class="q-pa-md main-wrapper">
        <div class="bg-box">
          <label for="">Name</label>
          <q-input
            outlined
            v-model="title"
            :dense="dense"
            placeholder="Name"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Name')]"
          />
          <label for="">Icon</label>
          <q-btn
            flat
            padding="none"
            color="primary"
            icon="info"
            class="info_tooltip"
          >
            <q-tooltip
              class="bg-purple text-body2"
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
            >
              <small
                >Max. Image Upload size 2 MB.<br />
                (Image Size in Pixel - 50x50)</small
              >
            </q-tooltip>
          </q-btn>
          <div>
            <q-input
              v-if="image == null"
              v-model="image"
              type="file"
              accept="image/*"
              @update:model-value="handleUpload()"
            />
          </div>
          <div v-if="image != null" class="image_icon_box">
            <img :src="image" spinner-color="white" />
            <i class="la la-trash" @click="image = null"></i>
          </div>
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
import { stressCategoryStore } from "src/stores/stressCategory";
import { useRoute, useRouter } from "vue-router";
import api from "src/apis/index";
import { SMM_CATEGORY } from "src/apis/constant";
import { Loading, Notify, QSpinnerGears } from "quasar";

const router = useRouter();
const route = useRoute();
const store = stressCategoryStore();
const title = ref("");

const slug = ref(null);
const edit_id = ref(null);

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
onMounted(() => {
  if (route.name !== "edit-smmCategory") {
    // isIdle.value = true;
  }
});

if (route.name == "edit-smmCategory") {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  slug.value = route.params.slug;
  api
    .get(api.resolveApiUrl(SMM_CATEGORY.SHOW, { id: slug.value }))
    .then((res) => {
      if (res.success == true) {
        console.log(res.data);
        edit_id.value = res.data.id;
        title.value = res.data.name;
        image.value = res.data.icon;
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
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  // if (image.value[0].name) {
  //   var blob = new Blob(image.value);
  // } else {
  //   var blob = image.value;
  // }

  const postData = new FormData();
  // postData.append("name", title.value);
  postData.append("name", title.value);
  if (image.value.startsWith("https://")) {
    postData.append("icon", image.value);
  } else {
    const response = await fetch(image.value);
    const blob = await response.blob();
    const newImage = new File([blob], "image.png");
    postData.append("icon", newImage, "image.png");
  }
  // postData.append("icon", blob);

  if (route.name == "edit-smmCategory") {
    store
      .updateStressCategory(postData, edit_id.value)
      .then((res) => {
        if (res.success) router.push({ name: "smmCategory-dashboard" });
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
      .saveNewStressCategory(postData)
      .then((res) => {
        if (res.success) router.push({ name: "smmCategory-dashboard" });
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

<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">
        {{ slug ? "Update" : "Create" }} Behavioral Article
      </h3>
    </div>
    <q-form @submit.prevent="onSubmit" ref="form">
      <div class="q-pa-md main-wrapper">
        <div class="bg-box">
          <label for="">Title</label>
          <q-input
            outlined
            v-model="title"
            :dense="dense"
            placeholder="title"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Title')]"
          />
          <label for="">Short Description</label>
          <q-input
            outlined
            v-model="short_description"
            :dense="dense"
            placeholder="Short Description"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Short Description')]"
          />
          <label for="">Image</label>
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
                (Image Size in Pixel - 800x400)</small
              >
            </q-tooltip>
          </q-btn>
          <div>
            <q-input
              max-total-size="2097152"
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
            <!-- v-if="route == 'edit-behavioralArticle'" -->
            <i class="la la-trash" @click="image = null"></i>
          </div>

          <q-editor
            v-model="long_description"
            :dense="$q.screen.lt.md"
            :toolbar="[
              [
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  list: 'only-icons',
                  options: ['left', 'center', 'right', 'justify'],
                },
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  options: ['left', 'center', 'right', 'justify'],
                },
              ],
              [
                'bold',
                'italic',
                'strike',
                'underline',
                'subscript',
                'superscript',
              ],
              ['token', 'hr', 'link', 'custom_btn'],
              ['print', 'fullscreen'],
              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
                },
                {
                  label: $q.lang.editor.fontSize,
                  icon: $q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7',
                  ],
                },
                {
                  label: $q.lang.editor.defaultFont,
                  icon: $q.iconSet.editor.font,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana',
                  ],
                },
                'removeFormat',
              ],
              ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

              ['undo', 'redo'],
              ['viewsource'],
            ]"
            :fonts="{
              arial: 'Arial',
              arial_black: 'Arial Black',
              comic_sans: 'Comic Sans MS',
              courier_new: 'Courier New',
              impact: 'Impact',
              lucida_grande: 'Lucida Grande',
              times_new_roman: 'Times New Roman',
              verdana: 'Verdana',
            }"
          />

          <div class="q-mt-md">
            <label for="">Select Behavioral Category</label>
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
import { behavioralArticleStore } from "src/stores/behavioralArticle";
import { behavioralCategoryStore } from "src/stores/behavioralCategory";
import { Loading, Notify, QSpinnerGears } from "quasar";

import { useRoute, useRouter } from "vue-router";
import api from "src/apis/index";
import { BEHAVIORAL_ARTICLE } from "src/apis/constant";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();
const store = behavioralArticleStore();
const title = ref("");
const short_description = ref("");

const long_description = ref("");

const categoryStore = behavioralCategoryStore();
categoryStore.fetchBehavioralCategoryList({ limit: "all" });

const slug = ref(null);
const edit_id = ref(null);

const category = ref([]);

// const category = computed(() => {
//   return categoryStore.behavioralCategoryList;
// });
function cancel() {
  history.go(-1);
}

const categoryList = computed(() => {
  const list = ref([]);
  categoryStore.behavioralCategoryList.forEach((item) => {
    // console.log(item);
    list.value.push({
      label: item.name,
      value: item.id,
    });
  });
  return list.value;
});

const image = ref(null);
const imageUrl = ref("");
// const maxFileSize = ref(2097152);
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
  if (route.name !== "edit-behavioralArticle") {
    // isIdle.value = true;
  }
});

function get_category(id) {
  return categoryList.value.find((item) => item.value === id)?.label;
}

if (route.name == "edit-behavioralArticle") {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  slug.value = route.params.slug;
  api
    .get(api.resolveApiUrl(BEHAVIORAL_ARTICLE.SHOW, { id: slug.value }))
    .then((res) => {
      if (res.success == true) {
        console.log(res.data);
        edit_id.value = res.data.id;
        title.value = res.data.title;
        short_description.value = res.data.short_description;
        long_description.value = res.data.long_description;
        image.value = res.data.image;
        category.value = {
          value: res.data.bhl_category_id,
          label: get_category(res.data.bhl_category_id),
        };
        console.log(category.value);
        // image.value = res.data.category_icon;
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
  postData.append("category_id", category.value.value);
  postData.append("title", title.value);
  if (image.value.startsWith("https://")) {
    postData.append("image", image.value);
  } else {
    const response = await fetch(image.value);
    const blob = await response.blob();
    const newImage = new File([blob], "image.png");
    postData.append("image", newImage, "image.png");
  }
  // postData.append("image", blob);
  postData.append("short_description", short_description.value);
  postData.append("long_description", long_description.value);

  if (route.name == "edit-behavioralArticle") {
    store
      .updateBehavioralArticle(postData, edit_id.value)
      .then((res) => {
        if (res.success) router.push({ name: "behavioralArticle-dashboard" });
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
      .saveNewBehavioralArticle(postData)
      .then((res) => {
        if (res.success) router.push({ name: "behavioralArticle-dashboard" });
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

<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">{{ slug ? "Update" : "Create" }} Inspiration</h3>
    </div>
    <q-form @submit.prevent="onSubmit" ref="form">
      <div class="q-pa-md main-wrapper">
        <div class="bg-box">
          <div class="q-mb-md">
            <label for="">Quote</label>
            <q-input
              outlined
              v-model="quote"
              :dense="dense"
              placeholder="Quote"
              class="create-user-field-box"
            />
          </div>
          <!-- :rules="[(val) => required(val, 'Quote')]" -->
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
              :offset="[10, 5]"
            >
              <small>Max. Image Upload size 2 MB.</small>
            </q-tooltip>
          </q-btn>
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
import { quoteStore } from "src/stores/quote";
import { useRoute, useRouter } from "vue-router";
import api from "src/apis/index";
import { QUOTE } from "src/apis/constant";
import { Loading, Notify, QSpinnerGears } from "quasar";

const router = useRouter();
const route = useRoute();
const store = quoteStore();
const quote = ref("");

const slug = ref(null);
const edit_id = ref(null);

const image = ref(null);
const imageUrl = ref("");

function cancel() {
  history.go(-1);
}

onMounted(() => {
  if (route.name !== "edit-quote") {
    // isIdle.value = true;
  }
});

if (route.name == "edit-quote") {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  slug.value = route.params.slug;
  api
    .get(api.resolveApiUrl(QUOTE.SHOW, { id: slug.value }))
    .then((res) => {
      if (res.success == true) {
        console.log(res.data);
        edit_id.value = res.data.id;
        quote.value = res.data.quote_text;
        image.value = res.data.quote_img;
        console.log(image.value);
        imageUrl.value = res.data.quote_img;
      }
      Loading.hide();
    })
    .catch((error) => {
      console.log(error);
      Loading.hide();
    })
    .finally(() => {
      Loading.hide();
    });
}

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

async function onSubmit() {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  const postData = new FormData();
  postData.append("quote_text", quote.value);

  if (image.value.startsWith("https://")) {
    postData.append("quote_img", image.value);
  } else {
    const response = await fetch(image.value);
    const blob = await response.blob();
    const newImage = new File([blob], "image.png");
    postData.append("quote_img", newImage, "image.png");
  }

  // if (image.value[0].name) {
  //   const response = fetch(image.value);
  //   var blob = response.blob();
  //   const quoteImage = new File([blob], "image.png");
  //   // var blob = new Blob(image.value);
  //   postData.append("quote_img", quoteImage);
  // } else {
  //   const quoteImage = image.value;
  //   postData.append("quote_img", quoteImage);
  // }

  // postData.append("quote_img", quoteImage);

  if (route.name == "edit-quote") {
    store
      .updateQuote(postData, edit_id.value)
      .then((res) => {
        if (res.success) router.push({ name: "quote-dashboard" });
        else {
          notification.error(res.message);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  } else {
    store
      .saveNewQuote(postData)
      .then((res) => {
        if (res.success) router.push({ name: "quote-dashboard" });
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

<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">
        {{ slug ? "Update" : "Create" }} {{ $q.lang.vibe.title }}
      </h3>
    </div>
    <q-form @submit.prevent="onSubmit" ref="form">
      <div class="q-pa-md main-wrapper">
        <div class="bg-box">
          <label for="">Answer</label>
          <q-input
            outlined
            v-model="answer"
            :dense="dense"
            placeholder="Answer"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Answer')]"
          />
          <label for="">Message</label>
          <q-input
            outlined
            v-model="message"
            :dense="dense"
            placeholder="Message"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Message')]"
          />
          <div class="q-pb-md">
            <label for="">Point</label>
            <q-input
              outlined
              v-model="point"
              :dense="dense"
              placeholder="Point"
              class="create-user-field-box"
            />
          </div>
          <!-- :rules="[(val) => required(val, 'Point')]" -->
          <label for="">Image</label
          ><q-btn
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
              :rules="[(val) => required(val, 'Image')]"
              @update:model-value="handleUpload()"
            />
          </div>
          <div v-if="image != null" class="image_icon_box">
            <img :src="image" spinner-color="white" />
            <i class="la la-trash" @click="image = null"></i>
          </div>
          <div>
            <label for="">Emoji</label
            ><q-btn
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
                v-if="emoji == null"
                v-model="emoji"
                type="file"
                accept="image/*"
                :rules="[(val) => required(val, 'Emoji')]"
                @update:model-value="handleUploadEmoji()"
              />
            </div>
            <div v-if="emoji != null" class="image_icon_box">
              <img :src="emoji" spinner-color="white" />
              <i class="la la-trash" @click="emoji = null"></i>
            </div>
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
import { vibeStore } from "src/stores/vibeOMeter";
import { useRoute, useRouter } from "vue-router";
import api from "src/apis/index";
import { VIBE } from "src/apis/constant";
import { Loading, Notify, QSpinnerGears } from "quasar";

const router = useRouter();
const route = useRoute();
const store = vibeStore();
const answer = ref("");
const message = ref("");
const point = ref("");

const slug = ref(null);
const edit_id = ref(null);

const image = ref(null);
const emoji = ref(null);
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
const handleUploadEmoji = () => {
  if (emoji.value) {
    if (emoji.value[0].size < 2097152) var blob = new Blob(emoji.value);
    emoji.value = URL.createObjectURL(blob);
  } else {
    emoji.value = null;
    Notify.create({
      type: "negative",
      message: "Max Image Size is 2 MB",
    });
  }
};

function cancel() {
  history.go(-1);
}
onMounted(() => {
  if (route.name !== "edit-vibeOMeter") {
    // isIdle.value = true;
  }
});

if (route.name == "edit-vibeOMeter") {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  slug.value = route.params.slug;
  api
    .get(api.resolveApiUrl(VIBE.SHOW, { id: slug.value }))
    .then((res) => {
      if (res.success == true) {
        console.log(res.data);
        edit_id.value = res.data.id;
        answer.value = res.data.answer;
        message.value = res.data.message;
        image.value = res.data.icon;
        emoji.value = res.data.emoji;
        point.value = res.data.points;
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
  postData.append("answer", answer.value);
  postData.append("message", message.value);
  postData.append("points", point.value);

  if (image.value.startsWith("https://")) {
  } else {
    const response = await fetch(image.value);
    const blob = await response.blob();
    const newImage = new File([blob], "image.png");
    postData.append("icon", newImage, "image.png");
  }
  if (emoji.value.startsWith("https://")) {
  } else {
    const responseEmoji = await fetch(emoji.value);
    const blobEmoji = await responseEmoji.blob();
    const newEmoji = new File([blobEmoji], "image.png");
    postData.append("emoji", newEmoji, "image.png");
  }

  if (route.name == "edit-vibeOMeter") {
    store
      .updateVibe(postData, edit_id.value)
      .then((res) => {
        if (res.success) router.push({ name: "vibeOMeter-dashboard" });
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
      .saveNewVibe(postData)
      .then((res) => {
        if (res.success) router.push({ name: "vibeOMeter-dashboard" });
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

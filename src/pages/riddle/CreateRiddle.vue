<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">{{ slug ? "Update" : "Create" }} Riddle</h3>
    </div>
    <q-form @submit.prevent="onSubmit" ref="form">
      <div class="q-pa-md main-wrapper">
        <div class="bg-box">
          <label for="">Riddle</label>
          <q-input
            outlined
            v-model="riddle"
            :dense="dense"
            placeholder="Riddle"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Riddle')]"
          />
          <label for="">Answer</label>
          <q-input
            outlined
            v-model="answer"
            :dense="dense"
            placeholder="Answer"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Answer')]"
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
import { defineAsyncComponent, onMounted, ref } from "vue";
import { riddleStore } from "src/stores/riddle";
import { useRoute, useRouter } from "vue-router";
import api from "src/apis/index";
import { RIDDLE } from "src/apis/constant";
import { Loading, QSpinnerGears } from "quasar";

const router = useRouter();
const route = useRoute();
const store = riddleStore();
const riddle = ref("");
const answer = ref("");

const slug = ref(null);
const edit_id = ref(null);

function cancel() {
  history.go(-1);
}

onMounted(() => {
  if (route.name !== "edit-riddle") {
    // isIdle.value = true;
  }
});

if (route.name == "edit-riddle") {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  slug.value = route.params.slug;
  api
    .get(api.resolveApiUrl(RIDDLE.SHOW, { id: slug.value }))
    .then((res) => {
      if (res.success == true) {
        console.log(res.data);
        edit_id.value = res.data.id;
        riddle.value = res.data.riddles;
        answer.value = res.data.answer;
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

function onSubmit() {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  const postData = new FormData();
  postData.append("riddles", riddle.value);
  postData.append("answer", answer.value);

  if (route.name == "edit-riddle") {
    store
      .updateRiddle(postData, edit_id.value)
      .then((res) => {
        if (res.success) router.push({ name: "riddle-dashboard" });
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
      .saveNewRiddle(postData)
      .then((res) => {
        if (res.success) router.push({ name: "riddle-dashboard" });
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

<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">
        {{ slug ? "Update" : "Create" }} {{ $q.lang.readiness.title }}
      </h3>
    </div>
    <q-form @submit.prevent="onSubmit" ref="form">
      <div class="q-pa-md main-wrapper">
        <div class="bg-box">
          <label for="">Question</label>
          <q-input
            outlined
            v-model="question"
            :dense="dense"
            placeholder="Question"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Question')]"
          />
          <!-- <label for="">Answer</label>
          <q-input
            outlined
            v-model="answer"
            :dense="dense"
            placeholder="Answer"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Answer')]"
          /> -->
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
import { readinessStore } from "src/stores/readiness";
import { useRoute, useRouter } from "vue-router";
import api from "src/apis/index";
import { READINESS } from "src/apis/constant";
import { Loading, QSpinnerGears } from "quasar";

const router = useRouter();
const route = useRoute();
const store = readinessStore();
const question = ref("");
const answer = ref("");

const slug = ref(null);
const edit_id = ref(null);

function cancel() {
  history.go(-1);
}

onMounted(() => {
  if (route.name !== "edit-readiness") {
    // isIdle.value = true;
  }
});

if (route.name == "edit-readiness") {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  slug.value = route.params.slug;
  api
    .get(api.resolveApiUrl(READINESS.SHOW, { id: slug.value }))
    .then((res) => {
      if (res.success == true) {
        console.log(res.data);
        edit_id.value = res.data.id;
        question.value = res.data.question;
        // answer.value = res.data.answer;
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
  postData.append("question", question.value);
  // postData.append("answer", answer.value);

  if (route.name == "edit-readiness") {
    store
      .updateReadiness(postData, edit_id.value)
      .then((res) => {
        if (res.success) router.push({ name: "readiness-dashboard" });
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
      .saveNewReadiness(postData)
      .then((res) => {
        if (res.success) router.push({ name: "readiness-dashboard" });
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

<template>
  <div>
    <div class="home_user_header">
      <h3 class="comman-title">
        {{ slug ? "Update" : "Create" }} {{ $q.lang.phqQuestion.title }}
      </h3>
    </div>
    <q-form @submit.prevent="onSubmit" ref="form">
      <div class="q-pa-md main-wrapper">
        <div class="bg-box">
          <label for="">Problem</label>
          <q-input
            outlined
            v-model="question"
            :dense="dense"
            placeholder="Problem"
            class="create-user-field-box"
            :rules="[(val) => required(val, 'Problem')]"
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
import { phq_QuestionStore } from "src/stores/phqQuestion";
import { useRoute, useRouter } from "vue-router";
import api from "src/apis/index";
import { PHQ_QUESTION } from "src/apis/constant";
import { Loading, QSpinnerGears } from "quasar";

const router = useRouter();
const route = useRoute();
const store = phq_QuestionStore();
const question = ref("");
const answer = ref("");

const slug = ref(null);
const edit_id = ref(null);

function cancel() {
  history.go(-1);
}

onMounted(() => {
  if (route.name !== "edit-phq_Question") {
    // isIdle.value = true;
  }
});

if (route.name == "edit-phq_Question") {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  slug.value = route.params.slug;
  api
    .get(api.resolveApiUrl(PHQ_QUESTION.SHOW, { id: slug.value }))
    .then((res) => {
      if (res.success == true) {
        console.log(res.data);
        edit_id.value = res.data.id;
        question.value = res.data.problems;
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
  postData.append("problems", question.value);
  // postData.append("answer", answer.value);

  if (route.name == "edit-phq_Question") {
    store
      .updatePhq_Question(postData, edit_id.value)
      .then((res) => {
        if (res.success) router.push({ name: "phq_Question-dashboard" });
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
      .saveNewPhq_Question(postData)
      .then((res) => {
        if (res.success) router.push({ name: "phq_Question-dashboard" });
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

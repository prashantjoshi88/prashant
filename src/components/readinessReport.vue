<template>
  <!-- {{ props.items }} -->
  <div>
    <div
      class="report_body_wrapper"
      v-for="(item, index) in props.items.PatientAnswers"
      :key="index"
    >
      <div class="report_head">
        <a href="#" class="logo"
          ><img src="~assets/images/logo.png" class="img-fluid" alt=""
        /></a>
        <h1 class="main_heading"><b>VW Health System-Readiness Ruler</b></h1>
      </div>

      <div class="patient_info_box_wrapper">
        <div class="patient_2column_box_bg readiness_ruler_bg">
          <div class="patient_info box1">
            <h5>Patient Information</h5>
            <ul class="list_patient_info">
              <li>
                <label>Name:</label>
                <span>{{ item.name }}</span>
              </li>
              <li>
                <label>Organization Name: </label>
                <span>{{ item.org?.name }}</span>
              </li>
              <li>
                <label>Medical ID:</label>
                <span>{{ item.patient_cr }}</span>
              </li>
              <li>
                <label>Date of Assessment:</label>
                <span>{{
                  moment(item.rediness[0]?.created_at).format("MM-DD-YYYY")
                }}</span>
              </li>
              <!-- <li>
              <label>Provisional Diagnosis:</label>
              <span>Lorem ipsum</span>
            </li> -->
            </ul>
          </div>
        </div>
      </div>
      <span v-for="value in readiness(item.rediness)" :key="value">
        <span v-for="question in sorting(value)" :key="question">
          <h2 class="form_heading" v-if="question.question_id == 1">
            Readiness Ruler -
            {{ moment(question.created_at).format("MM-DD-YYYY") }}
          </h2>

          <div
            class="ruler-horizontal-box first"
            v-if="question.question_id == 1"
          >
            <div class="ruler-important">
              <h4>Importance</h4>
            </div>
            <div class="readines-ruler-white-box">
              <h4>{{ props.items.questions[0].question }}</h4>
              <div class="ruler-background-radiness">
                <div id="radines-r" class="radio-title-group filter-switch">
                  <div
                    v-for="n in 10"
                    :key="n"
                    class="radio-btn-number filter-switch-item"
                  >
                    <q-radio
                      type="radio"
                      name="radines-r"
                      :model-value="parseInt(question.scale)"
                      :val="n"
                    >
                    </q-radio>

                    <label class="checked-ruler" for="ruler-counting-0">{{
                      n
                    }}</label>
                  </div>
                </div>
              </div>
              <div class="ruler-chart">
                <h5>Not</h5>
                <h5>Somewhat</h5>
                <h5>Very</h5>
              </div>
            </div>
          </div>

          <div
            v-if="question.question_id == 2"
            class="ruler-horizontal-box second"
          >
            <div class="ruler-important">
              <h4>Confidence</h4>
            </div>
            <div class="readines-ruler-white-box">
              <h4>{{ props.items.questions[1].question }}</h4>
              <div class="ruler-background-radiness">
                <div id="radines-r" class="radio-title-group filter-switch">
                  <div
                    v-for="n in 10"
                    :key="n"
                    class="radio-btn-number filter-switch-item"
                  >
                    <q-radio
                      type="radio"
                      name="radines-r"
                      :model-value="parseInt(question.scale)"
                      :val="n"
                    >
                    </q-radio>
                    <label class="checked-ruler" for="ruler-counting-0">{{
                      n
                    }}</label>
                  </div>
                </div>
              </div>
              <div class="ruler-chart">
                <h5>Not</h5>
                <h5>Somewhat</h5>
                <h5>Very</h5>
              </div>
            </div>
          </div>
        </span>
        <div
          :class="{
            sautDePage: index != props.items.PatientAnswers.length - 1,
          }"
        ></div>
      </span>
      <!-- <q-btn color="primary" @click="exportToPDF()"> Export to PDF </q-btn> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import moment from "moment";

const props = defineProps({
  items: Object,
});

function readiness(val) {
  const groups = val.reduce((groups, readiness) => {
    const date = readiness.created_at.split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(readiness);
    return groups;
  }, {});
  return groups;
}

function sorting(val) {
  return val.sort(function (a, b) {
    return a.question_id - b.question_id;
  });
}
</script>

<style lang="scss">
@import "src/css/redinessRulerReport.scss";

#mode {
  page-break-after: always;
}
.sautDePage {
  page-break-after: always;
}
.avoid {
  page-break-inside: avoid;
}
/* Big and bigger elements. */
.big {
  height: 10.9in;
  background-color: yellow;
  border: 1px solid black;
}
.fullpage {
  height: 11in;
  background-color: fuchsia;
  border: 1px solid black;
}
.bigger {
  height: 11.1in;
  background-color: aqua;
  border: 1px solid black;
}
//$
</style>

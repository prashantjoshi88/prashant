<template>
  <!-- {{ props.items }} -->
  <div>
    <div
      class="report_body_wrapper phq9report"
      v-for="(item, index) in props.items.PatientAnswers"
      :key="index"
    >
      <div class="report_head">
        <a href="#" class="logo"
          ><img src="~assets/images/logo.png" class="img-fluid" alt=""
        /></a>
        <h1 class="main_heading">
          <b>Demo System-Depression Scale PHQ9</b>
        </h1>
      </div>

      <div class="patient_info_box_wrapper">
        <div class="patient_2column_box_bg">
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
                <span
                  >{{ moment(item.phq9[0]?.created_at).format("MM-DD-YYYY") }}
                </span>
              </li>
              <!-- <li>
              <label>Provisional Diagnosis:</label>
              <span>Lorem ipsum</span>
            </li> -->
            </ul>
          </div>
          <div class="patient_info box2">
            <table class="phq_table_box">
              <thead>
                <tr>
                  <th>PHQ-9 Score</th>
                  <th>Interpretation</th>
                  <!-- Provisional Diagnosis / Treatment Recommendations (Patient
                    preference should be considered) -->
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0-4</td>
                  <td>0-4 points equals “normal” or minimal depression.</td>
                </tr>
                <tr>
                  <td>5-9</td>
                  <td>Scoring between 5-9 points indicates mild depression,</td>
                </tr>
                <tr>
                  <td>10-14</td>
                  <td>10-14 points indicates moderate depression,</td>
                </tr>
                <tr
                  :class="
                    parseInt(item.total) >= 15 && parseInt(item.total) <= 19
                      ? 'active'
                      : ''
                  "
                >
                  <td>15-19</td>
                  <td>
                    15-19 points indicates moderately severe depression, and
                  </td>
                </tr>
                <!-- class="active" -->
                <!-- <tr>
                  <td>10-14</td>
                  <td>
                    Major Depression - Mild / Antidepressant or psychotherapy
                  </td>
                </tr>
                <tr>
                  <td>15-19</td>
                  <td>
                    Major Depression - Moderately Severe / Antidepressant or
                    psychotherapy
                  </td>
                </tr> -->
                <tr :class="parseInt(item.total) >= 20 ? 'active' : ''">
                  <td>>=20</td>
                  <td>20 or more points indicates severe depression.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h2 class="form_heading phq9">
        <!-- Patient Health Questionnaire - {{ props.items.problems.length }} -->
      </h2>
      <h4 class="question_title">
        Over the past 2 weeks, how often have you been bothered by any of the
        following problems?
      </h4>
      <!-- <span>
      {{  moment(item.phq9.find(i => i.created_at).created_at).format("MM-DD-YYYY") }}
      </span> -->
      <div
        class="phq9_ques_list_bg"
        v-for="value in phq9(item.phq9)"
        :key="value"
      >
        <span v-for="items in sorting(value.phq)" :key="items">
          <h2 class="form_heading" v-if="items.phq9_problem_id == 1">
            PHQ-9 -
            {{ moment(items.created_at).format("MM-DD-YYYY") }}
          </h2>
          <div class="phq9_ques_list_box">
            <!-- <p class="qusetion">{{ props.items.problems[index].problems }}</p> -->
            <p class="qusetion">{{ getQue(items.phq9_problem_id) }}</p>

            <div>
              <div class="radio_group">
                <span v-for="ans in props.items.answers" :key="ans">
                  <q-radio
                    :val="ans.id"
                    :label="ans.answer"
                    :model-value="parseInt(items.phq9_answer_id)"
                  />
                </span>
              </div>
            </div>
          </div>
        </span>
        <div class="phq_total_wrapper">
          <div class="btn_box">
            <p>Total PHQ-9 Answer :</p>
            <span>{{ value.count }}</span>
          </div>
        </div>
        <div
          :class="{
            sautDePage: index != props.items.PatientAnswers.length - 1,
          }"
        ></div>
      </div>
      <!-- <div id="mode" class="sautDePage"></div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import moment from "moment";

const props = defineProps({
  items: Object,
});

// console.log(props.items);
const answers = ref([]);

function radio(val) {
  // console.log(val);
}

function getQue(id) {
  return props.items.problems.find((item) => item.id === id)?.problems;
}

// const phq9 = computed((val) => {

//   return val.sort(function (a, b) {
//     return a.phq9_problem_id - b.phq9_problem_id;
//   });
// });
function sorting(val) {
  return val.sort(function (a, b) {
    return a.phq9_problem_id - b.phq9_problem_id;
  });
}
const totalGroups = ref(0);
const groups = ref([]);

function phq9(val) {
  const groups = val.reduce((groups, phq9) => {
    const date = phq9.created_at.split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(phq9);
    return groups;
  }, {});

  // totalGroups.value = groups.length;

  // console.log(groups);
  const groupTotalPoints = Object.keys(groups).map((date) => {
    console.log(groups[date]);
    var count = 0;
    groups[date].forEach((element) => {
      count = count + element.points;
    });
    // groups[date].push(count);
    return { phq: groups[date], count };
  });
  console.log(groupTotalPoints);
  return groupTotalPoints;
}

props.items.PatientAnswers.forEach((items) => {
  // console.log(items);
  // answers.value.push(parseInt(items.answer_id));
  // if(items.answer_id ==)
});
</script>

<style lang="scss">
@import "src/css/redinessRulerReport.scss";

//$
// #mode {
//   page-break-after: always;
// }
.sautDePage {
  page-break-after: left;
}
// .before {
//   page-break-before: always;
// }
</style>

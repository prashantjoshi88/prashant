<template>
  <q-form @submit.prevent="onSubmit">
    <div class="home_user_header">
      <h3 class="comman-title">Import Patient</h3>
    </div>

    <div class="q-pa-md main-wrapper">
      <div class="bg-box">
        <!-- href="/files/Patients-sheet.xls"
            download -->
        <span>
          <q-btn
            color="primary"
            data="1"
            href="https://staging-vwhealth.s3.amazonaws.com/Patient.xlsx"
            download
            label="Download sample file"
          />
          <!-- @click="downloadFile()" -->
        </span>
        <div class="q-mt-lg q-mb-lg">
          <label for="">Organizations</label>

          <q-select
            hide-bottom-space
            outlined
            class="create-user-field-box"
            style="min-width: 300px"
            v-model="organizations"
            :options="organizationList"
            @update:model-value="selectOrg()"
            :rules="[(val) => val.length != 0 || required(val, 'Organization')]"
          />
        </div>
        <label for="">Add File</label>
        <q-input
          class="fileupload_box"
          hide-bottom-space
          type="file"
          @change="handleOnChange()"
          v-model="file"
          accept=".csv,.xlsx ,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :rules="[(val) => required(val, 'Sample file')]"
        />
        <h6 class="fileupload_note">
          Note : Sample file contain two example entries. Please delete them
          before submitting for import.
        </h6>
      </div>
      <div class="form_comon_btn q-mt-md q-mr-md q-mb-md">
        <q-btn outline color="primary" label="Cancel" @click="cancel" />
        <q-btn color="primary" type="submit" label="Submit" class="q-ml-md" />
      </div>
      <!-- {{ messages }} -->
      <div>
        <div v-if="messages" class="qchip_error_list_part">
          <q-chip
            color="red"
            class="text-white msg_qchip_box"
            v-for="(value, keys) in messages"
            :key="keys"
          >
            <div class="chip_box" v-for="key in Object.keys(value)" :key="key">
              <strong>{{ key }}</strong
              ><br />
              {{ value[key][0] }}

              <!-- <span v-for="i in 10" :key="i"> &nbsp; </span> -->
            </div>

            <q-btn
              color="primary"
              round
              icon="la la-times"
              @click="messages.splice(keys, 1)"
            >
            </q-btn>
          </q-chip>
        </div>
      </div>
      <!-- {{ messages }} -->
    </div>
  </q-form>
</template>
<script setup>
import { ref, computed } from "vue";
import { patientStore } from "src/stores/patient";
import { Loading, Notify, QSpinnerGears } from "quasar";
import saveAs from "file-saver";
import { exportFile } from "quasar";

const store = patientStore();
const file = ref();
const organizations = ref([]);
const messages = ref([]);
store.fetchOrganization();
const organizationList = computed(() => {
  return store.organizationList;
});

function selectOrg(val) {
  console.log(organizations.value);
  // organizations.value = val;
  // applyFilter();
}

function handleOnChange(e) {
  // console.log(file.value[0]);
  // file.value = file.value[0];
  // var blob = new Blob(file.value);
  // file.value = blob;
}

function downloadFile() {
  exportFile("Patients-sheet.xls", " name, email, phone_number, patient_cr");
}

function onSubmit() {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  // alert("imported");
  // console.log(file.value[0]);
  var blob = new Blob(file.value);
  const data = {
    org_id: organizations.value.value,
    files: blob,
  };

  const formData = new FormData();
  formData.append("org_id", organizations.value.value);
  formData.append("files", file.value[0]);

  store
    .importPatient(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      messages.value = res.data;

      if (res.success) {
        Notify.create({
          type: "positive",
          message: res.message,
        });
      }
      if (!res.success) {
        if (res.message) {
          Notify.create({
            type: "negative",
            message: res.message,
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      Loading.hide();
    });
}

function cancel() {
  history.go(-1);
}
</script>

<style lang="scss">
// $
.pass-feild {
  @include hr-vr-center-between;
}
.add_option_gruop {
  @include box-vr-center;
  .add_user_grup_btn {
    // background: #d9d9d9;
    width: 33.33%;
    height: $value-86;
    margin-right: $percentage-2;
    padding-right: $value-10;
    @include hr-vr-center;
    a {
      text-decoration: none;
      font-size: $value-20;
      margin-left: $value-10;
      color: #000000;
      font-weight: map-get($font-weights, medium);
    }
    &:last-child {
      margin-right: 0;
    }
  }
  .icon-btn {
    font-size: $value-50;
  }
}
h3.comman-title {
  font-size: $value-25;
  font-weight: map-get($font-weights, medium);
  margin-left: $value-33;
  padding-top: $value-20;
}
.create_user-text {
  p {
    font-size: $value-16;
    font-weight: map-get($font-weights, medium);
  }
}
.q-table__card {
  box-shadow: none;
}
.main-wrapper {
  .create-user-field-box {
    .q-field__control {
      height: $value-45;
    }
  }
}

.q-field--auto-height .q-field__control,
.q-field--auto-height .q-field__native {
  min-height: $value-45;
}

.select_drop_box {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.24);
  min-height: 45px;
  .q-btn__content {
    justify-content: space-between;
  }
}
.q-pr-none {
  padding-right: 0 !important;
}
.q-pl-none {
  padding-left: 0 !important;
}
.select_drop_list {
  .q-item {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .q-item__label {
    padding: 8px 15px;
  }
}
.select_drop_list {
  .q-item__label:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.msg_qchip_box {
  height: auto;
}
.qchip_error_list_part {
  .q-chip {
    width: 49%;
    margin: 0;
    margin-right: 1%;
    margin-top: 20px;
    background: rgb(244 67 54 / 20%) !important;
    color: #000 !important;
    border: 1px solid rgb(244 67 54 / 40%) !important;
    &:nth-child(2n + 2) {
      margin-right: 0;
    }
    .q-chip__content {
      display: block;
      .q-btn {
        position: absolute;
        top: -10px;
        right: -10px;
        min-width: 25px;
        min-height: 25px;
        padding: 0;
        display: flex;
      }
    }
  }
}

.fileupload_note {
  margin: $value-0;
}
.fileupload_box {
  .q-field__control {
    height: auto;
    &:before {
      display: none;
    }
  }
}
</style>

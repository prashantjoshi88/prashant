<template>
  <div class="">
    <q-table
      ref="tableRef"
      :title="title"
      :rows="rows"
      :columns="columns"
      row-key="index"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      @request="onRequest"
      :selection="selectionType"
      v-model:selected="selected"
      :selected-rows-label="getSelectedString"
      @selection="onSelection"
    >
      <!-- <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="image" :props="props">
            <q-img
              style="height: 80px; max-width: 80px"
              :src="props.row.image"
              :alt="props.row.imag"
            />
          </q-td>
        </q-tr>
      </template> -->
      <template v-slot:top-right v-if="route.name != 'home'">
        <div class="table_add_btn">
          <slot name="import"></slot>
          <q-btn
            v-if="props.type == 'report' && !props.isPdfDownload"
            dense
            color="secondary"
            icon="las la-download"
            @click="downloadPDF(reportData)"
            no-caps
          ></q-btn>
          <q-btn
            v-if="createUrl"
            dense
            color="primary"
            icon="las la-plus"
            :label="$q.lang.button.create"
            :to="createUrl"
            no-caps
          >
          </q-btn>

          <q-btn
            color="primary"
            icon-right="archive"
            label="Export to csv"
            no-caps
            @click="downloadTable"
          />
        </div>
        <q-input
          v-if="props.type != 'report'"
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:top-left>
        <slot name="filter"></slot>
      </template>
      <template
        v-if="route.name == 'consolidatedReport-dashboard'"
        v-slot:header
      >
        <slot name="counter"></slot>
      </template>
      <template #body-cell-image="props">
        <!-- <q-tr :props="props"> -->
        <!-- @click="
              imagePreview(
                props.row.image ??
                  props.row.category_icon ??
                  props.row.icon ??
                  props.row.quote_img ??
                  props.row.platform.icon
              )
            " -->
        <q-td key="image" :props="props">
          <q-img
            style="height: 80px; max-width: 80px"
            :src="
              props.row.image ??
              props.row.category_icon ??
              props.row.icon ??
              props.row.quote_img ??
              props.row.platform.icon
            "
          />
        </q-td>
      </template>
      <template #body-cell-emoji="props">
        <q-td key="emoji" :props="props">
          <q-img style="height: 80px; max-width: 80px" :src="props.row.emoji" />
        </q-td>
      </template>
      <template #body-cell-url="props">
        <q-td key="url" :props="props">
          <a class="text-black" :href="props.row.url" target="_blank">{{
            props.row.url
          }}</a>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td key="actions" :props="props">
          <span v-if="route.name == 'user-dashboard'">
            <q-btn
              color="primary"
              icon="refresh"
              label="Reset Two Factor "
              @click="resetTwoFactor(props.row)"
            />
            <q-btn
              v-if="props.row.account_status == 200"
              label="Unblock"
              @click="unblockUser(props.row)"
            />
            <q-toggle
              v-else
              :model-value="props.row.account_status"
              :false-value="0"
              :true-value="100"
              :icon="
                props.row.account_status == 0 ? 'lock' : 'fa-solid fa-lock-open'
              "
              @update:model-value="updateUserLock(props.row)"
            ></q-toggle>
          </span>
          <q-toggle
            v-if="route.name == 'patient-dashboard'"
            :model-value="props.row.status"
            :false-value="0"
            :true-value="100"
            :icon="props.row.status == 0 ? 'lock' : 'fa-solid fa-lock-open'"
            @update:model-value="updateUserLock(props.row)"
          ></q-toggle>
          <q-btn
            v-if="route.name == 'behavioralArticle-dashboard'"
            color="green"
            icon="las la-eye"
            @click="$emit('view', props.row)"
            size="sm"
            no-caps
          ></q-btn>
          <q-btn
            color="secondary"
            icon="las la-pen"
            @click="$emit('edit', props.row)"
            size="sm"
            no-caps
          ></q-btn>

          <q-btn
            v-if="route.name != 'patient-dashboard'"
            color="red"
            icon="las la-trash-alt"
            @click="deleteItem(props.row)"
            size="sm"
            no-caps
          ></q-btn>
        </q-td>
      </template>
      <template #body-cell-download="props">
        <q-td key="actions" :props="props">
          <q-btn
            color="secondary"
            icon="las la-download"
            @click="downloadPDF(props.row, 'single')"
            size="sm"
            no-caps
          ></q-btn>
        </q-td>
      </template>
      <!-- <template v-if="total" v-slot:bottom-row>
        <div>
          <q-tr>
            <q-td key="points" colspan="100%"> Total {{ total }} </q-td>
          </q-tr>
        </div>
      </template> -->

      <template v-if="props.noBottom" v-slot:bottom> </template>
    </q-table>
  </div>
  <q-dialog v-model="deleteDialog" class="alert-popup text-center">
    <q-card class="comman-close-popup">
      <q-card-section class="">
        <div
          class="alert-popup-content create_project_popup q_custum_popup new_common_popup_btn"
        >
          <div class="img-area">
            <div class="close-top-posi">
              <i class="las la-times" v-close-popup></i>
            </div>
          </div>
          <div class="text-center">
            <h5 class="q-my-sm">Are You Sure!</h5>
            <p class="del-item">
              Want To Delete This <b>{{ deleteData.name }}?</b>
            </p>
          </div>
          <q-card-actions align="center" class="bg-white text-teal">
            <q-btn outline color="primary" label="Cancel" v-close-popup />
            <q-btn
              color="primary"
              label="Yes Delete It!"
              @click="$emit('delete', deleteData)"
              v-close-popup
            />
          </q-card-actions>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <div style="display: none">
    <readinessComponent
      v-if="showReadiness"
      :items="pdfData"
      id="downloadPDF"
    />
  </div>

  <!-- style="display: none" -->
  <div style="display: none">
    <phqComponent v-if="showPhq" :items="pdfData" id="downloadPDF" />
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  computed,
  defineAsyncComponent,
  defineComponent,
} from "vue";
import apis from "src/apis";
import { useRoute } from "vue-router";
import { userStore } from "src/stores/users";
import notification from "src/boot/notification";
import { useMasterStore } from "src/stores/master";
import { date, exportFile, Loading, QSpinnerGears } from "quasar";
import moment from "moment";
import html2pdf from "html2pdf.js";
import { h } from "vue";

const props = defineProps({
  columns: Array,
  apiUrl: String,
  title: String,
  rowKey: String,
  createUrl: String,
  selectionType: String,
  selectedItem: Object,
  extraFilter: Object,
  type: Object,
  reportData: Object,
  orgId: Object,
  reportType: Object,
  isPdfDownload: Boolean,
  toggle: Object,
  noBottom: Boolean,
});

// console.log(props.toggle);

const now = new Date();

const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
//console.log(firstDay);

const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//console.log(lastDay);

//console.log(moment(lastDay).format("YYYY/MM/DD"));
// //console.log(props.reportData ?? { from_date: firstDay, to_date: lastDay });

const emit = defineEmits(["delete", "edit", "selected", "view", "lock"]);

const showPhq = ref(false);
const showReadiness = ref(false);
const showImage = ref(false);
const route = useRoute();
const storeUser = userStore();
const tableRef = ref();
const rows = ref([]);
const filter = ref("");
const loading = ref(false);
const deleteDialog = ref(false);
const previousTotal = ref(1);
const total = ref();
const totalLimit = ref();
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});
const master = useMasterStore();
const selected = ref(props.selectedItem ?? []);
const image = ref();
const readinessComponent = defineAsyncComponent(() =>
  import("./readinessReport.vue")
);
const phqComponent = defineAsyncComponent(() => import("./phq9Report.vue"));

const pdfData = ref([]);
// ************* DATE FORMATE FUNCTION ******************//

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join("-");
}

//             *********************

/////////// *************** EXPORT TO PDF *************** ///////////

function exportToPDF(data, item) {
  console.log(item);

  html2pdf(data, {
    margin: 0,
    filename: `${props.title}_${
      item.patient_cr ? item.patient_cr : formatDate(Date.now())
    }.pdf`,

    // pagebreak: { after: ".sautDePage" },
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 1, letterRendering: true },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  });
}

async function downloadPDF(item, type) {
  console.log(item);

  const data = {
    patient_id: item?.patient_id,
    org_id: item?.org_id,
  };
  console.log(type);
  if (type === "single") {
    data.from_date = item?.created_at.split("T")[0];
    data.to_date = item?.created_at.split("T")[0];
  } else {
    data.from_date =
      props.reportData?.from_date ?? moment(firstDay).format("YYYY-MM-DD");
    data.to_date =
      props.reportData?.to_date ?? moment(lastDay).format("YYYY-MM-DD");
  }

  if (props.reportType == "readiness") {
    Loading.show({
      message: "Loading...",
      spinner: QSpinnerGears,
    });
    await apis.post("report/readinessRuler", data).then((res) => {
      showReadiness.value = true;
      fetchPdf(res, item);
    });
  } else if (props.reportType == "phq9") {
    await apis.post("report/phq", data).then((res) => {
      Loading.show({
        message: "Loading...",
        spinner: QSpinnerGears,
      });
      showPhq.value = true;
      fetchPdf(res, item);
    });
  }
}

async function fetchPdf(res, item) {
  pdfData.value = res.data;
  setTimeout(() => {
    exportToPDF(document.getElementById("downloadPDF"), item ?? "");
    Loading.hide();
  }, 4000);
}
/////////// ***************************** ///////////

function imagePreview(val) {
  image.value = val;
  showImage.value = true;
}

/////////// *************** EXPORT TO CSV *************** ///////////

function wrapCsvValue(val, formatFn, row) {
  //console.log(val);
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

async function downloadTable(e) {
  Loading.show({
    message: "Loading...",
    spinner: QSpinnerGears,
  });
  const { page, rowsPerPage, sortBy, descending } = tableRef.value.pagination;
  const filter = tableRef.value.filter;
  const params = {
    page: page,
    limit: "all",
    q: filter,
    sortBy: sortBy,
    orderBy: descending,
  };
  if (props.extraFilter) {
    for (let [key, value] of Object.entries(props.extraFilter)) {
      params[key] = props.extraFilter[key];
    }
  }
  //console.log(tableRef.value);
  if (props.type == "report") {
    await apis
      .postWithParam(
        props.apiUrl,
        props.reportData ?? {
          from_date: moment(firstDay).format("YYYY-MM-DD"),
          to_date: moment(lastDay).format("YYYY-MM-DD"),
        },
        { limit: totalLimit.value }
      )
      .then((res) => {
        exportTable(
          !res.data.data
            ? res.data
            : res.data.data.data
            ? res.data.data.data
            : res.data.data
            ? res.data.data
            : res.data.res.data
        );
      })
      .finally(() => {
        Loading.hide();
      });
  } else {
    await apis
      .getWithParam(props.apiUrl, params)
      .then((res) => {
        exportTable(res.data);
      })
      .finally(() => {
        Loading.hide();
      });
  }
}

function exportTable(data) {
  // naive encoding to csv format
  const totalPoints = total.value
    ? props.columns.map((col) => {
        return wrapCsvValue(col.name == "points" ? `Total ${total.value}` : "");
      })
    : "";
  const content = [
    props.columns.map((col) => {
      if (col.label !== "Actions") {
        return wrapCsvValue(col.label);
      }
    }),
  ]

    .concat(
      data.map((row, index) =>
        props.columns
          .map((col) =>
            wrapCsvValue(
              col.field == "index"
                ? index + 1
                : typeof col.field === "function"
                ? col.field(row, index)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )

    .join("\r\n");
  //console.log(content.concat("\n", totalPoints));
  const status = exportFile(
    `${props.title}-${formatDate(Date.now())}.csv`,
    content.concat("\n", totalPoints),
    "text/csv"
  );

  if (status !== true) {
    $q.notify({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
}

/////////// ***************************** ///////////

async function onRequest(events) {
  const { page, rowsPerPage, sortBy, descending } = events.pagination;
  const filter = events.filter;
  // //console.log(events);
  loading.value = true;

  const fetchCount =
    rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;

  // fetch data from "server"
  const params = {
    org_id: props.orgId,
    page: page,
    limit: fetchCount,
    q: filter,
    sortBy: sortBy,
    orderBy: descending,
  };
  if (props.extraFilter) {
    for (let [key, value] of Object.entries(props.extraFilter)) {
      params[key] = props.extraFilter[key];
    }
  }

  if (page != 1) {
    previousTotal.value = page * rowsPerPage + 1 - rowsPerPage;
  } else {
    previousTotal.value = 1;
  }

  if (props.type == "report") {
    await apis
      .postWithParam(
        props.apiUrl,
        props.reportData ?? {
          from_date: moment(firstDay).format("YYYY-MM-DD"),
          to_date: moment(lastDay).format("YYYY-MM-DD"),
        },
        params
      )
      .then((res) => {
        // //console.log("response -->", props.reportData);
        rows.value.splice(
          0,
          rows.value.length,
          ...(!res.data.data
            ? res.data
            : res.data.data.data
            ? res.data.data.data
            : res.data.data
            ? res.data.data
            : res.data.res.data)
        );

        total.value = res.data.total;

        rows.value.forEach((row) => {
          row.index = previousTotal.value;
          previousTotal.value++;
        });

        // console.log(res.data.data);

        totalLimit.value = res.data.meta.total;

        // don't forget to update local pagination object
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = descending;
        pagination.value.rowsNumber =
          res.data.meta.total ?? res.data.res.meta.total;
        loading.value = false;
      })
      .catch((err) => {
        //console.log(err);
        loading.value = false;
      });
  } else {
    await apis
      .getWithParam(props.apiUrl, params)
      .then((res) => {
        //console.log("response -->", res);
        rows.value.splice(0, rows.value.length, ...res.data);

        rows.value.forEach((row) => {
          row.index = previousTotal.value;
          previousTotal.value++;
        });

        // don't forget to update local pagination object
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = descending;
        pagination.value.rowsNumber = res.meta.total;
        loading.value = false;
      })
      .catch((err) => {
        //console.log(err);
        loading.value = false;
      });
  }
}
function getSelectedString() {
  return selected.value.length === 0
    ? ""
    : `${selected.value.length} record${
        selected.value.length > 1 ? "s" : ""
      } selected of ${rows.value.length}`;
}
function onSelection({ rows, added }) {
  emit("selected", rows, added);
}

function updateUserLock(item) {
  storeUser.toggleUser(props.toggle, item.id).then((res) => {
    if (res.success == true) {
      storeUser.fetchUserCounter();
      notification.success(res.message);
    } else if (res.success == false) {
      notification.error(res.message);
    }
  });
  rows.value.find((row) => {
    if (row.id == item.id) {
      row.account_status = item.account_status == 0 ? 100 : 0;
      row.status = item.status == 0 ? 100 : 0;
    }
  });
}
function unblockUser(item) {
  storeUser.unblockUser(item.id).then((res) => {
    if (res.success == true) {
      notification.success(res.message);
    } else if (res.success == false) {
      notification.error(res.message);
    }
  });
}
function resetTwoFactor(item) {
  storeUser.resetTwoFA(item.id).then((res) => {
    if (res.success == true) {
      notification.success(res.message);
    } else if (res.success == false) {
      notification.error(res.message);
    }
  });
}

onMounted(() => {
  refresh();
  selected.value = props.selectedItem ?? [];
});

function refresh() {
  tableRef.value.requestServerInteraction();
}
defineExpose({
  refresh,
});

const deleteData = ref("");
function deleteItem(item) {
  deleteData.value = item;
  deleteDialog.value = true;
}
</script>

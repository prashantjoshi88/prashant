<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="custom_header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> </q-toolbar-title>
        <div class="header-profile-box">
          <div class="logo-text">
            {{ profileText }}
          </div>
          <div class="profile-user-name q-ml-sm">
            <h5>{{ user.name }}</h5>
          </div>
        </div>
        <div class="header-profile-dropdown">
          <q-btn-dropdown>
            <div class="header-profile-box q-mt-sm q-ml-md">
              <div class="logo-text">
                <h5>
                  {{ profileText }}
                </h5>
              </div>
              <div class="profile-user-name q-ml-sm">
                <h5>
                  <b>{{ user.name }}</b>
                </h5>
              </div>
            </div>
            <q-separator inset class="q-mt-md head-sep" />

            <q-list>
              <q-item clickable v-close-popup @click="changePassword">
                <q-item-section>
                  <q-item-label>
                    {{ $q.lang.mainLayout.profileDropdown.label1 }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="changeTwoFactor">
                <q-item-section>
                  <q-item-label>
                    {{ $q.lang.mainLayout.profileDropdown.label2 }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator inset />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>
                  <q-item-label>
                    {{ $q.lang.mainLayout.profileDropdown.label3 }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <!-- <Sidebar /> -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header class="logo_sidebar">
          <img src="~assets/images/logo.png" alt="" />
        </q-item-label>
        <q-list class="sidbar-collaps-right-border">
          <q-expansion-item
            :to="{ name: 'home' }"
            icon="home"
            :label="$q.lang.mainLayout.sidebar.home"
            class="hide_arrow"
          >
          </q-expansion-item>
          <q-expansion-item
            v-if="isSuperUser"
            expand-separator
            icon="las la-user"
            :label="$q.lang.mainLayout.sidebar.user"
          >
            <q-expansion-item
              :to="{ name: 'user-dashboard' }"
              icon="las la-users"
              :label="$q.lang.mainLayout.sidebar.users"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <!-- <q-expansion-item
              :to="{ name: 'role-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.label4"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'policy-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.label5"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item> -->
          </q-expansion-item>

          <q-expansion-item
            :to="{ name: 'patient-dashboard' }"
            :label="$q.lang.mainLayout.sidebar.patient"
            icon="las la-hospital"
            class="hide_arrow"
          >
          </q-expansion-item>

          <q-expansion-item
            v-if="isSuperUser"
            expand-separator
            icon="lab la-mastodon"
            :label="$q.lang.mainLayout.sidebar.masters"
          >
            <q-expansion-item
              :to="{ name: 'vibeOMeter-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.vibe"
              :header-inset-level="1"
              icon="las la-tachometer-alt"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'readiness-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.ruler"
              icon="las la-ruler-vertical"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'phq_Question-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.phqQ"
              icon="las la-ruler-horizontal"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'phq_Answer-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.phqA"
              icon="las la-ruler-horizontal"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
          </q-expansion-item>

          <q-expansion-item
            :to="{ name: 'quote-dashboard' }"
            :label="$q.lang.mainLayout.sidebar.inspiration"
            icon="las la-quote-left"
            class="hide_arrow"
          >
          </q-expansion-item>

          <q-expansion-item
            v-if="isSuperUser"
            expand-separator
            icon="las la-heartbeat"
            :label="$q.lang.mainLayout.sidebar.wellness"
          >
            <q-expansion-item
              :to="{ name: 'wellnessCategory-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.category"
              icon="las la-sitemap"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'wellnessTips-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.tips"
              icon="las la-stethoscope"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
          </q-expansion-item>

          <q-expansion-item
            :to="{ name: 'musicTherapy-dashboard' }"
            :label="$q.lang.mainLayout.sidebar.music"
            icon="las la-music"
            class="hide_arrow"
          >
          </q-expansion-item>

          <q-expansion-item
            v-if="isSuperUser"
            expand-separator
            icon="las la-wave-square"
            :label="$q.lang.mainLayout.sidebar.stressM"
          >
            <q-expansion-item
              :to="{ name: 'stressManagement-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.stress"
              icon="las la-tasks"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'smmCategory-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.category"
              icon="las la-sitemap"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'platformMaster-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.platform"
              icon="las la-sliders-h"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
          </q-expansion-item>

          <q-expansion-item
            v-if="isSuperUser"
            expand-separator
            icon="lab la-gratipay"
            :label="$q.lang.mainLayout.sidebar.behavior"
          >
            <q-expansion-item
              :to="{ name: 'behavioralCat-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.category"
              icon="las la-sitemap"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'behavioralArticle-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.article"
              icon="las la-newspaper"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
          </q-expansion-item>
          <q-expansion-item
            :to="{ name: 'riddle-dashboard' }"
            :label="$q.lang.mainLayout.sidebar.riddle"
            icon="las la-question-circle"
            class="hide_arrow"
          >
          </q-expansion-item>
          <q-expansion-item
            :to="{ name: 'doodle-dashboard' }"
            :label="$q.lang.mainLayout.sidebar.doodle"
            icon="las la-mask"
            class="hide_arrow"
          >
          </q-expansion-item>

          <q-expansion-item
            v-if="isSuperUser"
            expand-separator
            icon="las la-flag"
            :label="$q.lang.mainLayout.sidebar.reports"
          >
            <q-expansion-item
              :to="{ name: 'vibeReport-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.vibe"
              icon="las la-tachometer-alt"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'allVibeReport-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.allVibe"
              icon="las la-tachometer-alt"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'readinessReport-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.ruler"
              icon="las la-ruler-vertical"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'phq9report-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.phq"
              icon="las la-ruler-horizontal"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'behavioralReport-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.libraryReport"
              icon="las la-book-medical"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'loginReport-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.login"
              icon="las la-lock"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
            <q-expansion-item
              :to="{ name: 'consolidatedReport-dashboard' }"
              :label="$q.lang.mainLayout.sidebar.ConsolidatedReport"
              icon="las la-handshake"
              :header-inset-level="1"
              class="hide_arrow"
            >
            </q-expansion-item>
          </q-expansion-item>
        </q-list>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component, route }" :key="$route.fullPath">
        <transition :name="route.meta.transition || 'slide-up'">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";

const store = useAuthStore();
const user = computed(() => {
  return store.getUser;
});

const profileText = computed(() => {
  if (user.value) {
    const name = user.value.name?.split(" ");
    return `${name[0].charAt(0)}${name[1] ? name[1]?.charAt(0) : ""}`;
  } else {
    return "";
  }
});

const isSuperUser = computed(() => {
  return store.isSuperUser;
});
const router = useRouter();
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function changePassword() {
  router.push({ name: "change-password" });
}
function changeTwoFactor() {
  router.push({ name: "change-two-factor-security" });
}
function logout() {
  router.push({ name: "sign-in" });
  store.logout();
}
</script>

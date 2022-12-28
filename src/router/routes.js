function masterRoutes(path, pathname, folder, createFile, dashboardFile) {
  return {
    path: `/${path}`,
    meta: {
      requiresAuth: true,
      transition: "slide-right",
    },
    children: [
      {
        path: "",
        name: `${pathname}-dashboard`,
        component: () =>
          import(
            /* webpackChunkName:  "[request]" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            `src/pages/${folder}/${dashboardFile}.vue`
          ),
      },
      {
        path: "create",
        name: `create-${pathname}`,
        component: () =>
          import(
            /* webpackChunkName:"[request]" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            `src/pages/${folder}/${createFile}.vue`
          ),
        meta: {
          requiresAuth: true,
          transition: "slide-left",
        },
      },
      {
        path: "edit/:slug",
        name: `edit-${pathname}`,
        component: () =>
          import(
            /* webpackChunkName: "[request]" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            `src/pages/${folder}/${createFile}.vue`
          ),
        meta: {
          requiresAuth: true,
          transition: "slide-left",
        },
      },
    ],
  };
}

function reportRoutes(path, pathname, folder, dashboardFile) {
  return {
    path: `/${path}`,
    meta: {
      requiresAuth: true,
      transition: "slide-right",
    },
    children: [
      {
        path: "",
        name: `${pathname}-dashboard`,
        component: () =>
          import(
            /* webpackChunkName:  "[request]" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            `src/pages/${folder}/${dashboardFile}.vue`
          ),
      },
    ],
  };
}

// function requiredRoutes(path, pathname, filepath, meta) {
//   return {
//     path: path,
//     name: pathname,
//     component: () =>
//       import(
//         /* webpackChunkName: "[request]" */
//         /* webpackMode: "lazy" */
//         /* webpackInclude: /\.vue$/ */
//         `src/pages/${filepath}.vue`
//       ),
//     meta: {
//       ...(meta ? { requireGuest: true } : ""),
//     },
//   };
// }

const routes = [
  {
    path: "/",
    component: () =>
      import(
        /* webpackChunkName: "default-layout" */
        /* webpackMode: "lazy" */
        /* webpackInclude: /\.vue$/ */
        "layouts/DefaultLayout.vue"
      ),
    children: [
      {
        path: "/",
        name: "sign-in",
        component: () =>
          import(
            /* webpackChunkName: "sign-in" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            "src/pages/auth/LoginPage.vue"
          ),
        meta: {
          requireGuest: true,
        },
      },
      {
        path: "/enter-otp",
        name: "enter-otp",
        component: () =>
          import(
            /* webpackChunkName: "enter-otp" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            "src/pages/auth/OtpPage.vue"
          ),
        meta: {
          requireGuest: true,
        },
      },
      {
        path: "/two-factor-verification",
        name: "two-factor-verification",
        component: () =>
          import(
            /* webpackChunkName: "two-factor-verification" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            "src/pages/auth/TwoStepVerification.vue"
          ),
      },
      {
        path: "/reset-password",
        name: "reset-password",
        component: () =>
          import(
            /* webpackChunkName: "reset-password" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            "src/pages/auth/ResetPassword.vue"
          ),
        // meta: {
        //   requireGuest: true,
        // },
      },
      {
        path: "/two-factor-authentication-setup",
        name: "two-factor-authentication-setup",
        component: () =>
          import(
            /* webpackChunkName: "two-factor-authentication-setup" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            "src/pages/auth/2-f-auth-Setup.vue"
          ),
        // meta: {
        //   requireGuest: true,
        // },
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // User Routes
      masterRoutes("user", "user", "user", "CreateUserPage", "UserDashboard"),

      // Patient routes

      masterRoutes(
        "patient",
        "patient",
        "patient",
        "CreatePatientPage",
        "PatientDashboard"
      ),

      {
        path: "/bulk-import",
        name: "bulk-import",
        component: () =>
          import(
            /* webpackChunkName: "bulk-import" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            "src/pages/patient/bulkImport.vue"
          ),
      },
      // Quote Route

      masterRoutes("quote", "quote", "quote", "CreateQuote", "QuoteDashboard"),

      // Wellness Category Route

      masterRoutes(
        "wellnessCategory",
        "wellnessCategory",
        "WellnessCategory",
        "CreateWellnessCategory",
        "WellnessCategoryDashboard"
      ),

      // Wellness tips Route

      masterRoutes(
        "wellnessTips",
        "wellnessTips",
        "WellnessTips",
        "CreateWellnessTips",
        "WellnessTipsDashboard"
      ),

      // Stress Management Route

      masterRoutes(
        "stressManagement",
        "stressManagement",
        "stressManagement",
        "CreateStressManagement",
        "StressManagementDashboard"
      ),

      // Platform Master Route

      masterRoutes(
        "platformMaster",
        "platformMaster",
        "platformMaster",
        "CreatePlatformMaster",
        "platformMasterDashboard"
      ),

      // SMM-Category Route

      masterRoutes(
        "stress-management-category",
        "smmCategory",
        "stressManagementCategory",
        "CreateSmmCategory",
        "smmCategoryDashboard"
      ),

      // Music Therapy Route

      masterRoutes(
        "music-therapy",
        "musicTherapy",
        "musicTherapy",
        "CreateMusicTherapy",
        "musicTherapyDashboard"
      ),

      // Behavioral Category

      masterRoutes(
        "behavioral-category",
        "behavioralCat",
        "behavioralCategory",
        "CreateBehavioralCat",
        "behavioralCatDashboard"
      ),

      // Behavioral Article

      masterRoutes(
        "behavioral-article",
        "behavioralArticle",
        "behavioralArticle",
        "CreateBehavioralArticle",
        "behavioralArticleDashboard"
      ),

      // Riddle

      masterRoutes(
        "riddle",
        "riddle",
        "riddle",
        "CreateRiddle",
        "riddleDashboard"
      ),

      // Doodle

      masterRoutes(
        "doodle",
        "doodle",
        "doodle",
        "CreateDoodle",
        "doodleDashboard"
      ),

      // Vibe O Meter Master

      masterRoutes(
        "vibe-o-meter",
        "vibeOMeter",
        "vibeOMeter",
        "CreateVibeOMeter",
        "vibeOMeterDashboard"
      ),

      // Readiness Ruler Master
      masterRoutes(
        "readiness",
        "readiness",
        "readiness",
        "CreateReadiness",
        "readinessDashboard"
      ),

      // PHQ-9 QUESTION Master
      masterRoutes(
        "phq-9-problems",
        "phq_Question",
        "phqQuestion",
        "CreatePhqQue",
        "phqQueDashboard"
      ),

      // PHQ-9 ANSWER Master
      masterRoutes(
        "phq-9-answer",
        "phq_Answer",
        "phqAnswer",
        "CreatePhqAns",
        "phqAnsDashboard"
      ),

      // VIBE O METER REPORT
      reportRoutes(
        "vibe-o-meter-report",
        "vibeReport",
        "vibeReport",
        "vibeReportDashboard"
      ),
      reportRoutes(
        "all-vibe-o-meter-report",
        "allVibeReport",
        "vibeReport",
        "allVibeReportDashboard"
      ),

      // READINESS REPORT
      reportRoutes(
        "readiness-report",
        "readinessReport",
        "readinessReport",
        "readinessReportDashboard"
      ),

      // PHQ-9 REPORT
      reportRoutes(
        "phq-9-report",
        "phq9report",
        "phq9Report",
        "phq9ReportDashboard"
      ),

      // BEHAVIORAL REPORT
      reportRoutes(
        "behavioral-library-report",
        "behavioralReport",
        "behavioralReport",
        "behavioralReportDashboard"
      ),

      // LOGIN REPORT
      reportRoutes(
        "login-report",
        "loginReport",
        "loginReport",
        "loginReportDashboard"
      ),

      //ConsolidatedReport
      reportRoutes(
        "consolidated-report",
        "consolidatedReport",
        "ConsolidatedReport",
        "consolidatedReportDashboard"
      ),

      {
        path: "/change-two-factor-security",
        name: "change-two-factor-security",
        component: () =>
          import(
            /* webpackChunkName: "change-two-factor-security" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            "src/pages/auth/2-f-auth-Setup.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/change-password",
        name: "change-password",
        component: () =>
          import(
            /* webpackChunkName: "change-password" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            "src/pages/auth/ChangePassword.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/",
        name: "home",
        component: () =>
          import(
            /* webpackChunkName: "home" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /\.vue$/ */
            "src/pages/HomePage.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

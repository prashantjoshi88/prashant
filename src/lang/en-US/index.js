import auth from "./auth.js";
import policy from "./policy.js";
import group from "./group.js";
import user from "./user.js";
import patient from "./patient.js";

export default {
  button: {
    create: "Add",
    cancel: "Cancel",
    submit: "Save",
    continue: "Continue",
  },
  authentication: auth,
  policy: policy,
  group: group,
  user: user,
  patient: patient,

  mainLayout: {
    profileDropdown: {
      label1: "Change Password",
      label2: "Change Two Factor",
      label3: "Sign out",
    },
    sidebar: {
      home: "Home",
      user: "Admin User Access Control",
      wellness: "Wellness Tips",
      stressM: "Stress Management/ Meditation",
      behavior: "Behavioral Health Library",

      users: "Admin Users",
      // label4: "Roles",
      // label5: "Permissions",
      patient: "Patient Management",
      inspiration: "Inspiration of the Day",
      category: "Category",
      tips: "Tips ",
      stress: "Stress Management",
      // label12: "Category",
      platform: "Platform Master",
      music: "Music as Therapy",
      article: "Articles",
      riddle: "Riddle",
      doodle: "Doodle",
      masters: "Masters",
      reports: "Reports",
      vibe: "Vibe O Meter",
      allVibe: "Vibe O Meter (All)",
      ruler: "Readiness Ruler",
      phq: "PHQ-9",
      phqQ: "PHQ-9 Problem",
      phqA: "PHQ-9 Answers ",
      libraryReport: "Behavioral Library Report",
      login: "Patients Login Report",
      ConsolidatedReport: "Consolidated Report",
    },
  },
  homepage: {
    list: {
      title1: "Name",
      title2: "Actions",
    },
  },
  create: {
    title1: "Edit/Update",
    title2: "Create",
  },
  wellness: {
    tips: "Wellness Tips",
    category: "Wellness Tips Category",
  },
  stress: {
    management: "Stress Management",
    category: "Stress Management Category",
    platform: "Platform Master",
  },
  quote: {
    title: "Inspiration of the Day",
  },
  music: {
    title: "Music as Therapy",
  },
  behavioral: {
    article: "Behavioral Article",
    category: "Behavioral Category",
  },
  riddle: {
    title: "Riddle",
  },
  doodle: {
    title: "Doodle",
  },
  vibe: {
    title: "Vibe O Meter",
  },
  readiness: {
    title: "Readiness Ruler",
  },
  phqQuestion: {
    title: "PHQ-9 Problems",
  },
  phqAnswer: {
    title: "PHQ-9 Answer",
  },
};

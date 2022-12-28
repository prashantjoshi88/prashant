const rolePrefix = "/role";
const permissionPrefix = "/permission";
const userPrefix = "/user";
const patientPrefix = "/patient";
const quotePrefix = "/qotd";
const organizationPrefix = "/org";
const wellnessCategoryPrefix = "/wtc";
const wellnessTipsPrefix = "/wellnesstips";
const stressManagementPrefix = "/ssm";
const platformMasterPrefix = "/platformstr";
const smmCategoryPrefix = "/ssmc";
const musicalTherapyPrefix = "/musictherapy";
const behavioralCategoryPrefix = "/bhlc";
const behavioralArticlePrefix = "/bhl";
const doodlePrefix = "/doodles";
const riddlePrefix = "/riddles";
const readinessPrefix = "/readiness";
const vibePrefix = "/vibeo";
const phqQuePrefix = "/phq9problem";
const phqAnsPrefix = "/phq9answer";
const vibeReportPrefix = "/vibeo/answerList";
const readinessReportPrefix = "/readiness/readiness_list";
const PHQ9ReportPrefix = "/phq9problem/phq9list";

function apiMaster(prefix) {
  return {
    LIST: prefix,
    SAVE: prefix,
    UPDATE: `${prefix}/:id`,
    SHOW: `${prefix}/:id`,
    DELETE: `${prefix}/:id`,
  };
}

export const PERMISSION = apiMaster(permissionPrefix);
export const ROLE = apiMaster(rolePrefix);
export const PATIENT = apiMaster(patientPrefix);
export const QUOTE = apiMaster(quotePrefix);
export const WELLNESS_CATEGORY = apiMaster(wellnessCategoryPrefix);
export const WELLNESS_TIPS = apiMaster(wellnessTipsPrefix);
export const STRESS_MANAGEMENT = apiMaster(stressManagementPrefix);
export const PLATFORM_MASTER = apiMaster(platformMasterPrefix);
export const SMM_CATEGORY = apiMaster(smmCategoryPrefix);
export const MUSIC_THERAPY = apiMaster(musicalTherapyPrefix);
export const BEHAVIORAL_CATEGORY = apiMaster(behavioralCategoryPrefix);
export const BEHAVIORAL_ARTICLE = apiMaster(behavioralArticlePrefix);
export const DOODLE = apiMaster(doodlePrefix);
export const VIBE = apiMaster(vibePrefix);
export const RIDDLE = apiMaster(riddlePrefix);
export const READINESS = apiMaster(readinessPrefix);
export const PHQ_QUESTION = apiMaster(phqQuePrefix);
export const PHQ_ANSWER = apiMaster(phqAnsPrefix);
export const VIBE_REPORT = apiMaster(vibeReportPrefix);
export const READINESS_REPORT = apiMaster(readinessReportPrefix);
export const PHQ_9_REPORT = apiMaster(PHQ9ReportPrefix);
// export const ORGANIZATION = organizationPrefix;

export const USER = {
  LIST: userPrefix,
  SAVE: userPrefix,
  UPDATE: `${userPrefix}/:id`,
  SHOW: `${userPrefix}/:id`,
  DELETE: `${userPrefix}/:id`,
  TOGGLE: `${userPrefix}/toggle/:id`,
  ResetTwoFA: `${userPrefix}/reset-two-fa/:id`,
  UNBLOCK: `${userPrefix}/unblock/:id`,
  COUNTER: `${userPrefix}/counter`,
};

export const ORGANIZATION = {
  LIST: organizationPrefix,
};

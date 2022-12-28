import { ref } from "vue";

export default function useServerError() {
  const errors = ref([]);

  const serverValidationError = (errors, fieldName) => {
    return errors && errors[fieldName] ? errors[fieldName][0] : false;
  };

  return {
    errors,
    serverValidationError,
  };
}

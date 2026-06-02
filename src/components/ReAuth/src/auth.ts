import { defineComponent } from "vue";
import { hasAuth } from "@/router/utils";

export default defineComponent({
  name: "Auth",
  props: {
    value: {
      type: undefined,
      default: []
    }
  },
  setup(props, { slots }) {
    return () => (hasAuth(props.value) ? slots.default?.() : null);
  }
});

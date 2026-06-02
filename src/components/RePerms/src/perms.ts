import { defineComponent } from "vue";
import { hasPerms } from "@/utils/auth";

export default defineComponent({
  name: "Perms",
  props: {
    value: {
      type: undefined,
      default: []
    }
  },
  setup(props, { slots }) {
    return () => (hasPerms(props.value) ? slots.default?.() : null);
  }
});

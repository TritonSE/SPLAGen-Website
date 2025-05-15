import { GlobalState } from "little-state-machine";

export default function updateDirectoryForm(
  state: GlobalState,
  payload: Partial<GlobalState["directoryForm"]>, // Allow partial updates
) {
  return {
    ...state,
    directoryForm: {
      ...(state.directoryForm || {}),
      ...payload,
    },
  };
}

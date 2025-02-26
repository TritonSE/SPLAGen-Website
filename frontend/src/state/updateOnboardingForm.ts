import { GlobalState } from "little-state-machine";

export default function updateOnboardingForm(
  state: GlobalState,
  payload: Partial<GlobalState["onboardingForm"]>, // Allow partial updates
) {
  return {
    ...state,
    onboardingForm: {
      ...(state.onboardingForm || {}),
      ...payload,
    },
  };
}

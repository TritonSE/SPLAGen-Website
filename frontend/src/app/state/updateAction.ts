import { State } from "../state/stateTypes";

export default function updateAction(state: State, payload: State["data"]) {
  return {
    ...state,
    data: {
      ...state.data,
      ...payload,
    },
  };
}

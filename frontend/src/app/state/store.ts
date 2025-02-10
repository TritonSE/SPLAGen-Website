import { createStore } from "little-state-machine";

import { State } from "./stateTypes";

const initialState: State = {
  data: {
    professionalTitle: "",
    country: "",
    field1: "",
  },
};

createStore(initialState);

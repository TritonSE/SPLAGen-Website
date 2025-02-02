/* eslint-disable @typescript-eslint/no-unsafe-call */
import { createStore } from "little-state-machine";

import { State } from "./stateTypes";

const initialState: State = {
  data: {
    professionalTitle: "",
    country: "",
  },
};

createStore(initialState);

export {};
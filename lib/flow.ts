import type { EntryScenario } from "./storage";
import type { Interests, PlaceChoice } from "./types";

export type Screen =
  | "intro"
  | "cat"
  | "ask"
  | "celebration"
  | "place"
  | "dates"
  | "interests"
  | "thankyou"
  | "secondChance"
  | "finalRejection";

export type FlowData = {
  place?: PlaceChoice;
  availableDates: string[];
  interests: Interests;
};

export type FlowState = {
  scenario: EntryScenario;
  screen: Screen;
  data: FlowData;
};

export type FlowAction =
  | { type: "GO"; screen: Screen }
  | { type: "SET_PLACE"; place: PlaceChoice }
  | { type: "SET_DATES"; dates: string[] }
  | { type: "SET_INTERESTS"; interests: Interests }
  | { type: "RESTART" };

export const EMPTY_DATA: FlowData = {
  place: undefined,
  availableDates: [],
  interests: { food: [], topics: [], music: [], custom: [] },
};

export function initFlow(scenario: EntryScenario): FlowState {
  return { scenario, screen: "intro", data: { ...EMPTY_DATA } };
}

/** Screens that should render in the cooler "rejection" palette. */
export function isCoolScreen(screen: Screen): boolean {
  return screen === "secondChance" || screen === "finalRejection";
}

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "GO":
      return { ...state, screen: action.screen };
    case "SET_PLACE":
      return { ...state, data: { ...state.data, place: action.place } };
    case "SET_DATES":
      return { ...state, data: { ...state.data, availableDates: action.dates } };
    case "SET_INTERESTS":
      return { ...state, data: { ...state.data, interests: action.interests } };
    case "RESTART":
      return { ...state, screen: "intro", data: { ...EMPTY_DATA } };
    default:
      return state;
  }
}

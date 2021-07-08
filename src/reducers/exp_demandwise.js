import {
  GET_EXP_DEMANDWISE_DATA,
  SET_DATA_LOADING_EXP_DEMANDWISE,
  EXP_DEMANDWISE_DATA_ERROR } from "../actions/types";

const initialState = {
  data: { vizData:{}, tableData:{}},
  dateRange: ["2018-04-01","2019-03-31"],
  activeFilters: {},
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_EXP_DEMANDWISE_DATA:
      return {
        ...state,
        data: payload.data,
        dateRange: payload.dateRange,
        activeFilters: payload.activeFilters,
        loading: false
      };
    case SET_DATA_LOADING_EXP_DEMANDWISE:
      return {
        ...state,
        loading: true
      };
    case EXP_DEMANDWISE_DATA_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}

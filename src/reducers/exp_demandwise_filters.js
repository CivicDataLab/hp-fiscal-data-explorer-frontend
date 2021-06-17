import {
  GET_EXP_DEMANDWISE_FILTERS_DATA,
  UPDATE_EXP_DEMANDWISE_FILTERS_DATA,
  SET_DATA_LOADING_EXP_DEMANDWISE_FILTERS,
  EXP_DEMANDWISE_FILTERS_DATA_ERROR } from "../actions/types";

const initialState = {
  allFiltersData: [],
  rawFilterData: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_EXP_DEMANDWISE_FILTERS_DATA:
      return {
        ...state,
        allFiltersData: payload.allFiltersData,
        rawFilterData: payload.rawFilterData,
        loading: false
      };
    case UPDATE_EXP_DEMANDWISE_FILTERS_DATA:
      return {
        ...state,
        allFiltersData: payload
      }
    case EXP_DEMANDWISE_FILTERS_DATA_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case SET_DATA_LOADING_EXP_DEMANDWISE_FILTERS:
      return {
        ...state,
        loading: true
      }
    default:
      return state;
  }
}

import {
  SET_LOADING_RECEIPTS_FILTERS,
  GET_RECEIPTS_FILTERS_DATA,
  UPDATE_RECEIPTS_FILTERS_DATA,
  RECEIPTS_FILTERS_DATA_ERROR,
 } from "../actions/types";

const initialState = {
  allFiltersData: [],
  rawFilterData: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_RECEIPTS_FILTERS_DATA:
      return {
        ...state,
        allFiltersData: payload.allFiltersData,
        rawFilterData: payload.rawFilterData,
        loading: false
      };
    case UPDATE_RECEIPTS_FILTERS_DATA:
      return {
        ...state,
        allFiltersData: payload
      }
    case RECEIPTS_FILTERS_DATA_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case SET_LOADING_RECEIPTS_FILTERS:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}

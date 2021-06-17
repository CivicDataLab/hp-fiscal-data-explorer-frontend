import {
  GET_RECEIPTS_DISTRICTWISE_FILTERS_DATA,
  SET_DATA_LOADING_RECEIPTS_DISTRICTWISE_FILTERS,
  RECEIPTS_DISTRICTWISE_FILTERS_DATA_ERROR,
  UPDATE_RECEIPTS_DISTRICTWISE_FILTERS_DATA } from "../actions/types";

const initialState = {
  allFiltersData: [],
  rawFilterDataAllHeads: {},
  rawFilterData: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_RECEIPTS_DISTRICTWISE_FILTERS_DATA:
      return {
        ...state,
        allFiltersData: payload.allFiltersData,
        rawFilterDataAllHeads: payload.rawFilterDataAllHeads,
        loading: false
      };
    case SET_DATA_LOADING_RECEIPTS_DISTRICTWISE_FILTERS:
      return {
        ...state,
        loading: true
      };
    case RECEIPTS_DISTRICTWISE_FILTERS_DATA_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case UPDATE_RECEIPTS_DISTRICTWISE_FILTERS_DATA:
      return {
        ...state,
        allFiltersData: payload.allFiltersData,
        loading: false
      };
    default:
      return state;
  }
}

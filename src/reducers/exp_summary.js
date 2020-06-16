import { GET_EXP_SUMMARY_DATA, SET_EXP_SUMMARY_DATA_LOADING, EXP_SUMMARY_DATA_ERROR } from "../actions/types";

const initialState = {
  initData: {},
  vizData: [],
  lineChrtData: {},
  tableData: {},
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_EXP_SUMMARY_DATA:
      return {
        ...state,
        initData: payload.initData,
        vizData: payload.vizData,
        lineChrtData: payload.lineChrtData,
        tableData: payload.tableData,
        loading: false
      };
    case SET_EXP_SUMMARY_DATA_LOADING:
      return {
        ...state,
        loading: true
      };
    case EXP_SUMMARY_DATA_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}

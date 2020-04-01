import axios from "axios";
import {
  GET_RECEIPTS_DISTRICTWISE_FILTERS_DATA,
  RECEIPTS_DISTRICTWISE_FILTERS_DATA_ERROR,
  SET_DATA_LOADING_RECEIPTS_DISTRICTWISE_FILTERS,
  UPDATE_RECEIPTS_DISTRICTWISE_FILTERS_DATA
} from "./types";
import { getReceiptsDistrictwiseData } from "./receipts_districtwise";


import { onDateRangeChange, recursFilterFetch, recursFilterFind2, resetFiltersToAllFilterHeads } from "../utils/functions";

var { receipts_districtwise : filterOrderRef } = require("../data/filters_ref.json");
var yymmdd_ref = require("../data/yymmdd_ref.json");

export const getReceiptsDistrictwiseFiltersData = (allFiltersData, rawFilterDataAllHeads) => async dispatch => {
  try {

      console.log("here1");
			//fetch raw filter data all heads only if we dont already have it in redux store
      if(Object.keys(rawFilterDataAllHeads).length === 0){
        dispatch({ type: SET_DATA_LOADING_RECEIPTS_DISTRICTWISE_FILTERS, payload: {} });
        rawFilterDataAllHeads = await axios.get("http://13.126.189.78/api/unique_acc_heads_treasury_rec");
      }

			console.log('raw_filter_data_all_heads: '); console.log(rawFilterDataAllHeads);

      //populate all dropdown filters' data from the raw response provided by API
      allFiltersData = resetFiltersToAllFilterHeads( rawFilterDataAllHeads, filterOrderRef);

      dispatch({
        type: GET_RECEIPTS_DISTRICTWISE_FILTERS_DATA,
        payload: { allFiltersData, rawFilterDataAllHeads }
      });

  }catch(err){
    dispatch({
      type: RECEIPTS_DISTRICTWISE_FILTERS_DATA_ERROR,
      payload: err
    });
  }
}


export const updateReceiptsDistrictwiseFilters = (e, key, activeFilters, allFiltersData, rawFilterDataAllHeads ) => async dispatch => {
  try {
    dispatch({ type: SET_DATA_LOADING_RECEIPTS_DISTRICTWISE_FILTERS, payload: {} });
    //call dynamic filter data API if we have some active filters. e.g. a filter was selected
    console.log('here');

    if( Object.keys(activeFilters).length > 0){
      const currFilterOrderIndex = filterOrderRef.indexOf(key);

      allFiltersData.map((filterObj, i) => {
        if( i > currFilterOrderIndex){
          filterObj.val = [];
        }
      })

console.log('here');
      //2 fetch raw filter data
      const activeFilterKeys = Object.keys(activeFilters);
      const activeFilterVals = Object.values(activeFilters);
      var stringForApi = "";
      activeFilterVals.map((val, i) => {
          let tempVal = val.map(item => { return item.split('-')[0]});
          tempVal = tempVal.join('","');
          stringForApi +=  activeFilterKeys[i] + '="' + tempVal + '"';
          if(i < activeFilterVals.length - 1){
            stringForApi += '&';
          }
      })
      const rawFilterData = await axios.get(`http://13.126.189.78/api/acc_heads_treasury_rec?${stringForApi}`);
      // console.log('raw_dynamic_filter_data: ');
      // console.log(rawFilterData);

console.log('here');
      const results = [];
      var query;
      var queryFilterIdx;

      if(e.selectedItems.length === 0){
        for(var i = currFilterOrderIndex ; i >= 0 ; i--){
          if(activeFilters[filterOrderRef[i]]){

            query = activeFilters[filterOrderRef[i]].map(filterVal => {
              return { id : filterVal }
            })
            queryFilterIdx = i;
            // console.log(query);
            break;
          }
        }
      }else{
        query = e.selectedItems;
        queryFilterIdx = currFilterOrderIndex;
      }
console.log('here');
      recursFilterFind2(rawFilterData.data.records, query, results, 0, filterOrderRef, activeFilters, queryFilterIdx );
      console.log("district_results");
      console.log(results);
      results.map(result => {
        console.log('ran map');
        recursFilterFetch( allFiltersData, result, queryFilterIdx+1);
      })
      console.log(allFiltersData);
    }
    //else if we have no active filters fetch rawFilterDataAllHeads and populate allFiltersData. e.g. when active filters are deselected.
    else{
      console.log("allFiltersData_before");
      console.log(allFiltersData);
      allFiltersData = resetFiltersToAllFilterHeads(rawFilterDataAllHeads, filterOrderRef);
      console.log("allFiltersData_after");
      console.log(allFiltersData);
    }

    dispatch({
      type: UPDATE_RECEIPTS_DISTRICTWISE_FILTERS_DATA,
      payload: { allFiltersData }
    });


  }catch(err){
    dispatch({
      type: RECEIPTS_DISTRICTWISE_FILTERS_DATA_ERROR,
      payload: err
    });
  }
}

export const updateReceiptsDistrictwiseOnDateRangeChange = (initData, newDateRange, activeFilters) => async dispatch => {
  dispatch(getReceiptsDistrictwiseData(initData, activeFilters, onDateRangeChange(newDateRange), true)); //true = getExpDistrictwiseData is being triggered by date range change

}
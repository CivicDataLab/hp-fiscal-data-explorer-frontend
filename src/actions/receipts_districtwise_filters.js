import axios from "axios";
import {
  GET_RECEIPTS_DISTRICTWISE_FILTERS_DATA,
  RECEIPTS_DISTRICTWISE_FILTERS_DATA_ERROR,
  SET_DATA_LOADING_RECEIPTS_DISTRICTWISE_FILTERS,
  UPDATE_RECEIPTS_DISTRICTWISE_FILTERS_DATA
} from "./types";
import { getReceiptsDistrictwiseData } from "./receipts_districtwise";


import {
  onDateRangeChange,
  recursFilterFetch,
  recursFilterFind2,
  resetFiltersToAllFilterHeads,
  prepQueryStringForFiltersApi
} from "../utils/functions";

var { receipts_districtwise : filterOrderRef } = require("../data/filters_ref.json");
var yymmdd_ref = require("../data/yymmdd_ref.json");

export const getReceiptsDistrictwiseFiltersData = (allFiltersData, rawFilterDataAllHeads) => async dispatch => {
  try {

			//fetch raw filter data all heads only if we dont already have it in redux store
      if(Object.keys(rawFilterDataAllHeads).length === 0){
        dispatch({ type: SET_DATA_LOADING_RECEIPTS_DISTRICTWISE_FILTERS, payload: {} });
        rawFilterDataAllHeads = await axios.get("https://hpback.openbudgetsindia.org/api/unique_acc_heads_treasury_rec");
      }

			console.log('raw_filter_data_all_heads: ', rawFilterDataAllHeads);

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

      //2 fetch raw filter data
      let stringForApi = prepQueryStringForFiltersApi(activeFilters);

      const rawFilterData = await axios.get(`https://hpback.openbudgetsindia.org/api/acc_heads_treasury_rec?${stringForApi}`);
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

      recursFilterFind2(rawFilterData.data.records, query, results, 0, filterOrderRef, activeFilters, queryFilterIdx );
      // console.log("district_results", results);

      results.map(result => {
        recursFilterFetch( allFiltersData, result, queryFilterIdx+1);
      })
      // console.log(allFiltersData);
    }
    //else if we have no active filters fetch rawFilterDataAllHeads and populate allFiltersData. e.g. when active filters are deselected.
    else{

      allFiltersData = resetFiltersToAllFilterHeads(rawFilterDataAllHeads, filterOrderRef);

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

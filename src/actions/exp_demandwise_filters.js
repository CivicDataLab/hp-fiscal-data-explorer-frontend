import axios from "axios";
import {
  GET_EXP_DEMANDWISE_FILTERS_DATA,
  UPDATE_EXP_DEMANDWISE_FILTERS_DATA,
  EXP_DEMANDWISE_FILTERS_DATA_ERROR,
  SET_DATA_LOADING_EXP_DEMANDWISE_FILTERS
} from "./types";

import { getExpDemandwiseData } from "./exp_demandwise";
import { onDateRangeChange, recursFilterFetch, recursFilterFind2 } from "../utils/functions";

var { exp_demandwise : filterOrderRef } = require("../data/filters_ref.json");
var yymmdd_ref = require("../data/yymmdd_ref.json");


export const getExpDemandwiseFiltersData = () => async dispatch => {
  try {
      dispatch({
        type: SET_DATA_LOADING_EXP_DEMANDWISE_FILTERS,
        payload: ''
      })
			//fetch raw filter data
			const rawFilterData = await axios.get("https://hpback.openbudgetsindia.org/api/acc_heads_desc");
			console.log('raw_filter_data: '); console.log(rawFilterData);

      const allFiltersData = []
      filterOrderRef.map(filter_name => {
        allFiltersData.push({
          key: filter_name,
          val: [ { filter_name, id : 'all', label : 'All'} ]
        })
      })

      //populate all dropdown filters' data from the raw response provided by API
      recursFilterFetch(allFiltersData, rawFilterData.data.records, 0);

      dispatch({
        type: GET_EXP_DEMANDWISE_FILTERS_DATA,
        payload: { allFiltersData, rawFilterData }
      });

  }catch(err){
    dispatch({
      type: EXP_DEMANDWISE_FILTERS_DATA_ERROR,
      payload: err
    });
  }
}

export const updateExpDemandwiseOnFilterChange = (
  e,
  key,
  activeFilters,
  allFiltersData,
  rawFilterData,
  dateRange
) => async dispatch => {

  if(Object.keys(activeFilters).length > 0){
    const currFilterOrderIndex = filterOrderRef.indexOf(key);

    //1 repopulate allFiltersData
    allFiltersData.map((filterObj, i) => {
      if( i > currFilterOrderIndex){
        filterObj.val = [];
      }
    })

    //2 repopulate allFiltersData with new filter data.
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

    results.map(result => {
      recursFilterFetch( allFiltersData, result, queryFilterIdx+1);
    })

  }else{
    console.log("get All Filters Data Again");
    allFiltersData = [];
    filterOrderRef.map(filter_name => {
      allFiltersData.push({
        key: filter_name,
        val: []
      })
    })
    //populate all dropdown filters' data from the raw filter data
    recursFilterFetch(allFiltersData, rawFilterData.data.records, 0);
  }

  dispatch({
    type: UPDATE_EXP_DEMANDWISE_FILTERS_DATA,
    payload: allFiltersData
  });
  dispatch(getExpDemandwiseData(activeFilters, dateRange)); //update expData state at App level
}


export const updateExpDemandwiseOnDateRangeChange = (newDateRange, activeFilters) => async dispatch => {
  dispatch(getExpDemandwiseData(activeFilters, onDateRangeChange(newDateRange))); //update expData state at App level
}

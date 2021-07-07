import axios from "axios";
import {
  GET_EXP_SCHEMES_FILTERS_DATA,
  EXP_SCHEMES_FILTERS_DATA_ERROR,
  SET_DATA_LOADING_EXP_SCHEMES_FILTERS,
  UPDATE_EXP_SCHEMES_FILTERS_DATA
} from "./types";
import { getExpSchemesData } from "./exp_schemes";


import { onDateRangeChange, recursFilterFetch, recursFilterFind2, resetFiltersToAllFilterHeads } from "../utils/functions";

var { exp_schemes : filterOrderRef } = require("../data/filters_ref.json");
var yymmdd_ref = require("../data/yymmdd_ref.json");

export const getExpSchemesFiltersData = (allFiltersData, rawFilterDataAllHeads) => async dispatch => {
  try {

      dispatch({ type: SET_DATA_LOADING_EXP_SCHEMES_FILTERS, payload: {} });
			//fetch raw filter data all heads only if we dont already have it in redux store
      if(Object.keys(rawFilterDataAllHeads).length === 0){
        console.log("need to fetch raw district filter data");
        rawFilterDataAllHeads = await axios.get("https://hpback.openbudgetsindia.org/api/unique_acc_heads_schemes");

      }

			console.log('raw_filter_data_all_heads: '); console.log(rawFilterDataAllHeads);

      //populate all dropdown filters' data from the raw response provided by API
      allFiltersData = resetFiltersToAllFilterHeads( rawFilterDataAllHeads, filterOrderRef);

      dispatch({
        type: GET_EXP_SCHEMES_FILTERS_DATA,
        payload: { allFiltersData, rawFilterDataAllHeads }
      });

  }catch(err){
    dispatch({
      type: EXP_SCHEMES_FILTERS_DATA_ERROR,
      payload: err
    });
  }
}


export const updateExpSchemesFilters = (e, key, activeFilters, allFiltersData, rawFilterDataAllHeads ) => async dispatch => {
  try {
    dispatch({ type: SET_DATA_LOADING_EXP_SCHEMES_FILTERS, payload: {} });

    //call dynamic filter data API if we have some active filters. e.g. a filter was selected
    if( Object.keys(activeFilters).length > 0){
      const currFilterOrderIndex = filterOrderRef.indexOf(key);

      allFiltersData.map((filterObj, i) => {
        if( i > currFilterOrderIndex){
          filterObj.val = [];
        }
      })

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

      const rawFilterData = await axios.get(`https://hpback.openbudgetsindia.org/api/acc_heads_schemes?${stringForApi}`);
      // console.log('raw_dynamic_filter_data: ');
      // console.log(rawFilterData);

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
      console.log("district_results");
      console.log(results);
      results.map(result => {
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
      type: UPDATE_EXP_SCHEMES_FILTERS_DATA,
      payload: { allFiltersData }
    });


  }catch(err){
    dispatch({
      type: EXP_SCHEMES_FILTERS_DATA_ERROR,
      payload: err
    });
  }
}

export const updateSchemesOnDateRangeChange = (initData, newDateRange, activeFilters) => async dispatch => {
  dispatch(getExpSchemesData(initData, activeFilters, onDateRangeChange(newDateRange), true)); //update expData state at App level
}

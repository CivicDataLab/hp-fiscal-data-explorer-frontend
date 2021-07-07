import axios from "axios";
import {
  GET_RECEIPTS_FILTERS_DATA,
  UPDATE_RECEIPTS_FILTERS_DATA,
  RECEIPTS_FILTERS_DATA_ERROR,
  SET_LOADING_RECEIPTS_FILTERS
} from "./types";
import { getReceiptsData } from "./receipts";
import { onDateRangeChange, recursFilterFetch, recursFilterFind, recursFilterFind2 } from "../utils/functions";

var { receipts : filterOrderRef } = require("../data/filters_ref.json");

export const getReceiptsFiltersData = () => async dispatch => {
  try {
    console.log("Fetching Receipts Filters Started");
    dispatch({ type: SET_LOADING_RECEIPTS_FILTERS, payload: "" });
		//fetch raw filter data
		const rawFilterData = await axios.get("https://hpback.openbudgetsindia.org/api/acc_heads_receipts");
		console.log('raw_receipts_filter_data: '); console.log(rawFilterData);

    const allFiltersData = []
    filterOrderRef.map(filter_name => {
      allFiltersData.push({
        key: filter_name,
        val: []
      })
    })

    //populate all dropdown filters' data from the raw response provided by API
    recursFilterFetch(allFiltersData, rawFilterData.data.records, 0);

    dispatch({
      type: GET_RECEIPTS_FILTERS_DATA,
      payload: { allFiltersData, rawFilterData }
    });

  }catch(err){
    dispatch({
      type: RECEIPTS_FILTERS_DATA_ERROR,
      payload: err
    });
  }

}

export const updateReceiptsOnFilterChange = (e, key, activeFilters, allFiltersData, rawFilterData, dateRange) => async dispatch => {

  try{
    if( Object.keys(activeFilters).length > 0){
      const currFilterOrderIndex = filterOrderRef.indexOf(key);

      //1 repopulate allFiltersData
      allFiltersData.map((filterObj, i) => {
        if( i > currFilterOrderIndex){
          filterObj.val = [];
        }
      })

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
        recursFilterFetch( allFiltersData, result, queryFilterIdx+1); //+1 cuz we wanna populate filterData only from first child of currFilter onwards
      })

    // console.log("results");
    // console.log(results);
    }else{
      console.log("getAllFilterdsData Again ");
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

    dispatch({ type: UPDATE_RECEIPTS_FILTERS_DATA, payload: allFiltersData });
    dispatch(getReceiptsData(activeFilters, dateRange)); //update expData state at App level
  }catch(err){
    console.log("Receipts filters update error!");
  }

}

export const updateReceiptsOnDateRangeChange = (newDateRange, activeFilters) => async dispatch => {
  dispatch(getReceiptsData(activeFilters, onDateRangeChange(newDateRange))); //update expData state at App level
}

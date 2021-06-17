import axios from "axios";
import {
  GET_EXP_SCHEMES_DATA,
  SET_DATA_LOADING_EXP_SCHEMES,
  EXP_SCHEMES_DATA_ERROR,
  RESET_ACTIVE_FILTERS_AND_DATE_RANGE_SCHEMES,
  HYDRATE_SCHEMES_DATA_FROM_INITDATA
} from "./types";

import {
  getWeekwiseDates,
  calcMonthOrWeek,
  createBudgetCodeString,
  createObjForPayload,
  calcXTickVals,
  calcXTickFormats
} from '../utils/functions';

//data-refs
var yymmdd_ref = require("../data/yymmdd_ref.json");
var hp_geojson = JSON.stringify(require("../data/hp_geojson.json"));
const { exp_districtwise : filterOrderRef } = require("../data/filters_ref.json");


export const getExpSchemesData = (initData, activeFilters, dateRange, triggeredByDateRangeChange = false) => async dispatch => {
  try {

    if(Object.keys(activeFilters).length === 0 && initData && triggeredByDateRangeChange === false){
      dispatch({
        type: HYDRATE_SCHEMES_DATA_FROM_INITDATA,
        payload: {
          data: initData,
          dateRange: dateRange,
          activeFilters: activeFilters
        }
      });
    }else{

    const [ dateFrom , dateTo ] = dateRange;
    const { months , years, years_short } = yymmdd_ref;
    const month_week = calcMonthOrWeek(dateFrom, dateTo);
    const fromMonthIndex = parseInt(dateFrom.split('-')[1])-1;
    const fromYearIndex = years.indexOf(dateFrom.split('-')[0]);
    const toMonthIndex = parseInt(dateTo.split('-')[1])-1;

    const tempLineChrtData = [];
    const tempBarChrtData = [];
    const tempMapData = JSON.parse(hp_geojson);
    const tempTableData = { headers : [], rows : [] };

    const activeFilterKeys = Object.keys(activeFilters);
    const activeFilterVals = Object.values(activeFilters);

    const objForPayload = createObjForPayload(activeFilterVals, activeFilterKeys);
    // console.log("objForPayload", objForPayload);

    //0 SET LOADING TO TRUE
    dispatch({ type: SET_DATA_LOADING_EXP_SCHEMES, payload: {} });

    //1 PREP AND MAKE API CALL
    const config = { headers: { "content-type": "application/json" } };
		const res = await axios.post( `https://hpback.openbudgetsindia.org/api/schemes?start=${dateFrom}&end=${dateTo}&range=${month_week[0].toUpperCase() + month_week.slice(1)}`, {filters:objForPayload} );
		// console.log("exp districtwise raw data", res.data.records);
    if(Object.keys(res.data.records).length === 0) throw "emptyResponseError";

    //2 PREP DATA FOR VISUALIZATION
    const districtNames = Object.keys(res.data.records);
    const districtwiseSchemesVals = Object.values(res.data.records);

    //calc x-tick-vals if is week
    let xTickVals = calcXTickVals(month_week, districtwiseSchemesVals); //1----

    //calc x-tick-formats if is week
    let xTickFormats = calcXTickFormats(month_week, districtwiseSchemesVals, dateTo, dateFrom);  //2----
    // console.log("districtwiseSchemesVals", districtwiseSchemesVals);

    districtNames.map((districtName, i) => {
      let datewiseExp = [];
      let totalExp = { districtName, gross: 0, AGDED: 0, BTDED: 0, netPayment: 0};
      // datewiseExp.push({ "idx": 0, "date":(month_week === "month" ? " " : 0), "gross": 0, "AGDED": 0, "BTDED": 0,  "netPayment": 0});

      let distSchValsToMap = month_week === 'month'
      ? districtwiseSchemesVals[i]
      : districtwiseSchemesVals[i].map(d => d[1] ) ;

      distSchValsToMap.map((expArray, i) => {
        let dataObj = {};
        dataObj.idx = i+1;
        dataObj.districtName = districtName;
        dataObj.date = month_week === "month" ?
                       months[(i+fromMonthIndex)%12]+" "+years_short[Math.floor((i+fromMonthIndex)/12) + fromYearIndex]
                       : xTickFormats[i];
        dataObj.gross = expArray[0];
        dataObj.AGDED = expArray[1];
        dataObj.BTDED = expArray[2];
        dataObj.netPayment = expArray[3];
        datewiseExp.push(dataObj);

        totalExp.gross += expArray[0]
        totalExp.AGDED += expArray[1]
        totalExp.BTDED += expArray[2]
        totalExp.netPayment += expArray[3]
      })
      tempLineChrtData.push({
        districtName,
        datewiseExp,
        totalExp
      })
      tempBarChrtData.push(totalExp);
      tempMapData.features.map((feature,i) =>{
        const { properties : { NAME_2 : districtName_inJson }} = feature; //the district name as in the geojson
        if(districtName_inJson.toUpperCase() === districtName ){
          feature.properties.gross = totalExp.gross;
          feature.properties.AGDED = totalExp.AGDED;
          feature.properties.BTDED = totalExp.BTDED;
          feature.properties.netPayment = totalExp.netPayment;
        }else{
        }
      })
    })

    // console.log("tempLineChrtData", tempLineChrtData);
    // console.log("tempBarChrtData", tempBarChrtData);
    // console.log("tempMapData", tempMapData);

    //3 PREP DATA FOR TABLE
    tempTableData.headers.push(
      { key: 'districtName', header: 'District' },
      { key: 'treasuryCode', header: 'Treasury Code' },
      { key: 'budgetCode', header: 'Budget Code' },
      { key: 'gross', header: 'Gross (Lacs)' },
      { key: 'AGDED', header: 'AGDED (Lacs)' },
      { key: 'BTDED', header: 'BTDED (Lacs)' },
      { key: 'netPayment', header: 'Net Payment (Lacs)' }
    )

    tempBarChrtData.map((d, i) => {
    	tempTableData.rows.push({
    		id: i,
    		'districtName': d.districtName,
        'treasuryCode' : createBudgetCodeString(activeFilterVals, activeFilterKeys, filterOrderRef, [0, 2]),
        'budgetCode' : createBudgetCodeString(activeFilterVals, activeFilterKeys, filterOrderRef, [3, filterOrderRef.length-1]),
    		'gross': (d.gross/100000).toFixed(2).toLocaleString('en-IN'),
    		'AGDED': (d.AGDED/100000).toFixed(2).toLocaleString('en-IN'),
        'BTDED': (d.BTDED/100000).toFixed(2).toLocaleString('en-IN'),
    		'netPayment': (d.netPayment/100000).toFixed(2).toLocaleString('en-IN')
    	})
    })

    // console.log("tempTableData", tempTableData);

    dispatch({
      type: GET_EXP_SCHEMES_DATA,
      payload: {
        data: {
          mapData: tempMapData,
          barChrtData: {
            data:tempBarChrtData
          },
          lineChrtData: {
            xLabelVals: month_week === "week" ? xTickVals : 'null', //6---
            xLabelFormat: month_week === "week" ? xTickFormats : tempLineChrtData[0].datewiseExp.map(d => d.date),  //7---
            data:tempLineChrtData
          },
          tableData: tempTableData
        },
        dateRange: dateRange,
        activeFilters: activeFilters
      }
    });
  }
  } catch (err) {
    dispatch({
      type: EXP_SCHEMES_DATA_ERROR,
      payload: {
        filters : { dateRange, activeFilters },
        error : { status: err }
      }
    });
  }
};

export const resetActiveFiltersAndDateRange = () => async dispatch => {
  dispatch({
    type: RESET_ACTIVE_FILTERS_AND_DATE_RANGE_SCHEMES,
    payload: ''
  })
}

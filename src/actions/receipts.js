import axios from "axios";
import {
  GET_RECEIPTS_DATA,
  SET_DATA_LOADING_RECEIPTS,
  RECEIPTS_DATA_ERROR,
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
const { receipts : filterOrderRef } = require("../data/filters_ref.json");

export const getReceiptsData = (activeFilters, dateRange) => async dispatch => {
  try {

    const [ dateFrom , dateTo ] = dateRange;
    const { months , years, years_short } = yymmdd_ref;
    const month_week = calcMonthOrWeek(dateFrom, dateTo);
    const fromMonthIndex = parseInt(dateFrom.split('-')[1])-1;
    const fromYearIndex = years.indexOf(dateFrom.split('-')[0]);
    const toMonthIndex = parseInt(dateTo.split('-')[1])-1;

    const tempVizData = [];
    const tempTableData = { headers : [], rows : [] };

    const activeFilterKeys = Object.keys(activeFilters);
    const activeFilterVals = Object.values(activeFilters);

    const objForPayload = createObjForPayload(activeFilterVals, activeFilterKeys)

    console.log("objForPayload"); console.log(objForPayload);

    //0 SET LOADING TO TRUE
    dispatch({ type: SET_DATA_LOADING_RECEIPTS, payload: {} });

    //1 PREP AND MAKE API CALL
    // console.log("hello",`https://hpback.openbudgetsindia.org/api/detail_receipts_${month_week}?start=${dateFrom}&end=${dateTo}`)
    console.log("Axios Receipts Fetch Started");
    // console.log(`https://hpback.openbudgetsindia.org/api/detail_receipts_${month_week}?start=${dateFrom}&end=${dateTo}`)
    const config = { headers: {
      "content-type": "application/json",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "Content-Type"


    } };
		const res = await axios.post(
      `https://hpback.openbudgetsindia.org/api/detail_receipts_${month_week}?start=${dateFrom}&end=${dateTo}`, {filters:objForPayload}, config
    );
    if(Object.keys(res.data.records).length === 0) throw "emptyResponseError";

		console.log("receipts raw data"); console.log(res.data.records);
    //calc x-tick-vals if is week
    let xTickVals = calcXTickVals(month_week, [res.data.records]); //1----
    console.log("xTickVals", xTickVals);

    //calc x-tick-formats if is week
    let xTickFormats = calcXTickFormats(month_week, [res.data.records], dateTo, dateFrom);  //2----

    //2 PREP DATA FOR VISUALIZATION
    var highestRecord = 0;
    res.data.records.map((record, i) => {
      if(record[0] > highestRecord){
        highestRecord = record[0];
      }
    })
    highestRecord = Math.round(highestRecord);

    let valsToMap = month_week === 'month' //3----
    ? res.data.records
    : res.data.records.map(d => d[1] ) ;


    month_week === "month" &&
    tempVizData.push({"date": " ", "receipt": 0 });

    valsToMap.map((record, i) => {
      var dataObj = {};

      dataObj.date = month_week === "month" ?
                     months[(i+fromMonthIndex)%12]+" "+years_short[Math.floor((i+fromMonthIndex)/12) + fromYearIndex]
                     : xTickVals[i] //5----

      dataObj.receipt = Math.round(record[0]*100)/100;
      tempVizData.push(dataObj);
    })

    console.log("tempVizData");
    console.log(tempVizData);

    //3 PREP DATA FOR TABLE
    tempVizData.map((d, i) => {

    	i === 0 && tempTableData.headers.push(
        { key: 'date', header: month_week === "week" ? "WEEKWISE DATES" : "MONTHS" },
        { key: 'budgetCode', header: 'BUDGET CODE' },
        { key: 'receipt', header: 'TOTAL AMOUNT IN RUPEES' }
      );

    	i !== 0 && tempTableData.rows.push({
    		id: i,
    		'date': d.date,
        'budgetCode' : createBudgetCodeString(activeFilterVals, activeFilterKeys, filterOrderRef, [0, filterOrderRef.length-1]),
    		'receipt': (Math.round(d.receipt*100)/100).toLocaleString('en-IN'),
    	})
    })

    dispatch({
      type: GET_RECEIPTS_DATA,
      payload: {
        data: {
          vizData: {
            xLabelVals: month_week === "week" ? xTickVals : 'null', //6---
            xLabelFormat: month_week === "week" ? xTickFormats : tempVizData.map(d => d.date),  //7---
            data:tempVizData,
          },
          tableData: tempTableData
        },
        dateRange: dateRange,
        activeFilters: activeFilters
      }
    });

  } catch (err) {
    dispatch({
      type: RECEIPTS_DATA_ERROR,
      payload: {
        filters : { dateRange, activeFilters },
        error : { status: err }
      }
    });
  }
};

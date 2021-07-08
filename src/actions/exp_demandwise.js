import axios from "axios";

//redux dispatchers
import {
  GET_EXP_DEMANDWISE_DATA,
  SET_DATA_LOADING_EXP_DEMANDWISE,
  EXP_DEMANDWISE_DATA_ERROR
} from "./types";

//functions
import {
  getWeekwiseDates,
  calcMonthOrWeek,
  calcScsrOffset,
  createBudgetCodeString
} from '../utils/functions';

//data-refs
var yymmdd_ref = require("../data/yymmdd_ref.json");
const { exp_demandwise : filterOrderRef } = require("../data/filters_ref.json");

export const getExpDemandwiseData = (activeFilters, dateRange) => async dispatch => {
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

    var objForPayload = {};


    activeFilterVals.map((val, i) => {
        let tempVal = val.map(item => { return item.split('-')[0]});
        console.log("got here");
        tempVal = tempVal.join('","');
        // tempVal = tempVal.join(',');
        objForPayload[activeFilterKeys[i]] =  '"' + tempVal + '"';
        // objForPayload[activeFilterKeys[i]] =  tempVal;
    })


    console.log("objForPayload"); console.log(objForPayload);

    //0 SET LOADING TO TRUE
    dispatch({ type: SET_DATA_LOADING_EXP_DEMANDWISE, payload: {} });

    //1 PREP AND MAKE API CALL
    console.log("Axios Fetch Started");
    const config = { headers: { "content-type": "application/json" } };
    const res = await axios.post(
      `http://13.126.189.78/api/detail_exp_${month_week}?start=${dateFrom}&end=${dateTo}`, {filters:objForPayload}, config
    );
    console.log("demand details raw data "); console.log(res.data.records);

    //2 PREP DATA FOR VISUALIZATION
    var highestRecord = 0;
    tempVizData.push({"date":(month_week === "month" ? " " : 0), "sanction": 0, "addition": 0, "savings": 0, "revised": 0, "mark": 0});
    res.data.records.map((record, i) => {
      var dataObj = {};
      if(i === 0){ //first we identify highest record to define the 'height of mark' appropriately
        res.data.records.map((record, i) => {
          if(record[0]+record[1] > highestRecord){
            highestRecord = record[0]+record[1];
          }
        })
      }

      dataObj.date = month_week === "month" ?
                     months[(i+fromMonthIndex)%12]+" "+years_short[Math.floor((i+fromMonthIndex)/12) + fromYearIndex] :
                     getWeekwiseDates( dateFrom, fromMonthIndex, toMonthIndex, fromYearIndex).date_for_x_axis[i];
      dataObj.sanction = Math.round(record[0]*100)/100;
      dataObj.addition = Math.round(record[1]*100)/100;
      dataObj.savings = Math.round(record[2]*100)/100;
      dataObj.revised = Math.round(record[3]*100)/100;
      dataObj.mark = Math.round((1/100)*highestRecord);
      tempVizData.push(dataObj);
    })

    console.log("tempVizData")
    console.log(tempVizData)

    //3 PREP DATA FOR TABLE
    tempVizData.map((d, i) => {

    	i === 0 && tempTableData.headers.push(
        { key: 'date', header: 'Date' },
        { key: 'budgetCode', header: 'Budget Code' },
        { key: 'sanction', header: 'Sanction' },
        { key: 'addition', header: 'Addition' },
        { key: 'savings', header: 'Savings' },
        { key: 'revised', header: 'Revised' }
      );

    	i !== 0 && tempTableData.rows.push({
    		id: i,
    		'date': d.date,
        'budgetCode' : createBudgetCodeString(activeFilterVals, activeFilterKeys, filterOrderRef, [0, filterOrderRef.length-1]),
    		'sanction': (Math.round(d.sanction*100)/100).toLocaleString('en-IN'),
    		'addition': (Math.round(d.addition*100)/100).toLocaleString('en-IN'),
    		'savings': (Math.round(d.savings*100)/100).toLocaleString('en-IN'),
    		'revised': (Math.round(d.revised*100)/100).toLocaleString('en-IN'),

    	})
    })

    dispatch({
      type: GET_EXP_DEMANDWISE_DATA,
      payload: {
        data: {
          vizData: {
            xLabelVals:getWeekwiseDates( dateFrom, fromMonthIndex, toMonthIndex, fromYearIndex).date_for_x_axis,
            xLabelFormat: month_week === "week" ? getWeekwiseDates( dateFrom, fromMonthIndex, toMonthIndex, fromYearIndex).date_for_tick : null,
            data:tempVizData,
            scsrOffset: calcScsrOffset(tempVizData)
          },
          tableData: tempTableData
        },
        dateRange: dateRange,
        activeFilters: activeFilters
      }
    });
  } catch (err) {
    dispatch({
      type: EXP_DEMANDWISE_DATA_ERROR,
      payload: {
        status: err
      }
    });
  }
};

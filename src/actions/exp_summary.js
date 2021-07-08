import axios from "axios";
import { GET_EXP_SUMMARY_DATA, EXP_SUMMARY_DATA_ERROR, SET_EXP_SUMMARY_DATA_LOADING } from "./types";


export const getExpSummaryData = () => async dispatch => {
  try {
    dispatch({ type: SET_EXP_SUMMARY_DATA_LOADING, payload: ""});
    const res = await axios.get("http://13.126.189.78/api/exp_summary");
    var tableData = {
    	headers: [],
    	rows: []
    }

    //
    res.data.records.map((d, i) => {

    	i === 0 && tableData.headers.push(
        { key: 'demandid', header: 'Demand ID' },
        { key: 'demandname', header: 'Demand Name' },
        { key: 'sanctioncurrent', header: 'Sanction This Year (INR)' },
        { key: 'sanctionprevious', header: 'Sanction Last Year (INR)' },
        { key: 'rateOfChange', header: '% Change' }
      );

    	tableData.rows.push({
    		id: i,
    		'demandid': d.demand,
    		'demandname': d.demand_description,
    		'sanctioncurrent': (Math.round(d.sanction_current*100)/100).toLocaleString('en-IN'),
    		'sanctionprevious': (Math.round(d.sanction_previous*100)/100).toLocaleString('en-IN'),
    		'rateOfChange': (Math.round(d.pct_change*100)/100).toLocaleString('en-IN')

    	})
    })

    dispatch({
      type: GET_EXP_SUMMARY_DATA,
      payload: {
        vizData: res.data.records,
        tableData
      }
    });
  } catch (err) {
    dispatch({
      type: EXP_SUMMARY_DATA_ERROR,
      payload: {
        status: err
      }
    });
  }
};

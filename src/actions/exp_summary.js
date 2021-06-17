import axios from "axios";
import { GET_EXP_SUMMARY_DATA, EXP_SUMMARY_DATA_ERROR, SET_EXP_SUMMARY_DATA_LOADING } from "./types";


export const getExpSummaryData = (current, previous, rawData) => async dispatch => {
  try {
    let res, yearsToCompare,aryOfYears
    if(rawData){
      res = rawData
      yearsToCompare = [current, previous]
      aryOfYears = Object.keys(res.data.records); //all the years that are being returned by data from jewset to oldest
    }
    else{
      dispatch({ type: SET_EXP_SUMMARY_DATA_LOADING, payload: ""});
      res = await axios.get("https://hpback.openbudgetsindia.org/api/allocation_exp_summary");
      aryOfYears = Object.keys(res.data.records); //all the years that are being returned by data from jewset to oldest
      yearsToCompare = [aryOfYears[0], aryOfYears[1]] //gets newest and second to newest F year
    }

    let initData = res

    let vizData = [];

    let newestYearDataObj = res.data.records[yearsToCompare[0]];
    let prevYearDataObj = res.data.records[yearsToCompare[1]];

    const getPercent = (curr, prev) => {
      return Math.round((((curr / prev) - 1)*100)*100)/100;
    }

    Object.values(newestYearDataObj).map((d,i) => {
      let vizObj = {};
      let demand_string = Object.keys(newestYearDataObj)[i];
      let demand_id = demand_string.split('-')[0];
      let demand_desc = demand_string.split('-')[1];
      vizObj.curr_year = current ? current : aryOfYears[0];
      vizObj.prev_year = previous ? previous : aryOfYears[1];
      vizObj.demand = demand_id;
      vizObj.demand_description = demand_desc;
      vizObj.alloc = {
        current : d[0],
        previous : Object.values(prevYearDataObj)[i][0]
      };
      vizObj.alloc.pct_change = getPercent(vizObj.alloc.current, vizObj.alloc.previous);
      vizObj.exp = {
        current : d[1],
        previous : Object.values(prevYearDataObj)[i][1]
      };
      vizObj.exp.pct_change = getPercent(vizObj.exp.current, vizObj.exp.previous) // in relation to 1 not 100
      vizData.push(vizObj);
    })

    console.log('SMRY_VIZ_DATA', vizData);

//----------------

    let valuesFromAllYrs = Object.values(res.data.records);
    let keysFromAllYrs = Object.keys(res.data.records);

    console.log('vvvvvvv')
    console.log(valuesFromAllYrs)
    console.log(keysFromAllYrs)

    var lineChrtData = {};

    //calc tot alloc & exp amounts per year
    lineChrtData['All Demands'] = [
      { exp_alloc : 'allocated', yearwise : [] },
      { exp_alloc : 'expenditure', yearwise : [] }
    ]
    //calc tot vals per yearx
    aryOfYears.map((yr,i) => {
      let totAlloc = 0;
      let totExp = 0;
      Object.values(valuesFromAllYrs[i]).map(v => {
        totAlloc = totAlloc + v[0];
        totExp = totExp + v[1];
      })
      lineChrtData['All Demands'][0].yearwise.unshift({ idx : aryOfYears.length - 1 - i, year : yr.split('_').join('-'), amount : Math.round(totAlloc*100)/100 })
      lineChrtData['All Demands'][1].yearwise.unshift({ idx : aryOfYears.length - 1 - i, year : yr.split('_').join('-'), amount : Math.round(totExp*100)/100, pctUsed : Math.round((totExp / totAlloc)*100*100)/100+"%"})
    })

    //restructure api data for timeseries component
    Object.keys(valuesFromAllYrs[0]).map((k,i) => {
      lineChrtData[k] = [
        { exp_alloc : 'allocated', yearwise : [] },
        { exp_alloc : 'expenditure', yearwise : [] }
      ]
      //
      aryOfYears.map((yr,j) => {
        lineChrtData[k][0].yearwise.unshift({ idx : aryOfYears.length - 1 - j, year: yr.split('_').join('-'), amount: Object.values(valuesFromAllYrs[j])[i][0] }) //allocated
        lineChrtData[k][1].yearwise.unshift({ idx : aryOfYears.length - 1 - j, year: yr.split('_').join('-'), amount: Object.values(valuesFromAllYrs[j])[i][1], pctUsed: Object.values(valuesFromAllYrs[j])[i][2]  }) //expenditure
      })
    })



    console.log('timeseriesDataStructure', lineChrtData);
    // aryOfYears.map((yr,i) => {
    //   let lineChrtDataObj = [];
    //
    //
    // })

    var tableData = {
    	headers: [
        { key: 'demandname', header: 'Demand Name' },
      ],
    	rows: []
    }

    aryOfYears.map(yr => {
      tableData.headers.push(
        { key: `allocated__${yr}`, header: `Budget Allocated (${yr.split('_')[0] + ' - ' + yr.split('_')[1] })` },
        { key: `tot_exp__${yr}`, header: `Total Expenditure (${yr.split('_')[0] + ' - ' + yr.split('_')[1] })` },
        { key: `pct_spent__${yr}`, header: `Percentage Spent (${yr.split('_')[0] + ' - ' + yr.split('_')[1] })` },
      )
    })

    console.log('SMRY_TBL_DATA', tableData);



    Object.values(valuesFromAllYrs[0]).map((v, v_i) => {
      tableData.rows.push({
        id : v_i,
        demandname: Object.keys(valuesFromAllYrs[0])[v_i]
      })
/*      let i = 0;
      for (i<=aryOfYears.length; i++;){
        if (aryOfYears[i] == "2020_21") {
              aryOfYears.map(yr => {
                tableData.rows[v_i][`allocated__${yr}`] ="N/A";
                tableData.rows[v_i][`tot_exp__${yr}`] = (Object.values(res.data.records[yr])[v_i][1]/10000000).toFixed(2).toLocaleString('en-IN');
                tableData.rows[v_i][`pct_spent__${yr}`] = Object.values(res.data.records[yr])[v_i][2].toLocaleString('en-IN')+'%';
              })
            }
        
        else{
         aryOfYears.map(yr => {
                 tableData.rows[v_i][`allocated__${yr}`] = (Object.values(res.data.records[yr])[v_i][0]/10000000).toFixed(2).toLocaleString('en-IN');
                 tableData.rows[v_i][`tot_exp__${yr}`] = (Object.values(res.data.records[yr])[v_i][1]/10000000).toFixed(2).toLocaleString('en-IN');
                 tableData.rows[v_i][`pct_spent__${yr}`] = Object.values(res.data.records[yr])[v_i][2].toLocaleString('en-IN')+'%';
               })
             }
        }
      })*/
      aryOfYears.map(yr => {
        if (yr === "2020_21"){
        tableData.rows[v_i][`allocated__${yr}`] = (Object.values(res.data.records[yr])[v_i][0]/10000000).toFixed(2).toLocaleString('en-IN');
        tableData.rows[v_i][`tot_exp__${yr}`] = "N/A";
        tableData.rows[v_i][`pct_spent__${yr}`] = "N/A";
      }
      else{

        tableData.rows[v_i][`allocated__${yr}`] = (Object.values(res.data.records[yr])[v_i][0]/10000000).toFixed(2).toLocaleString('en-IN');
        tableData.rows[v_i][`tot_exp__${yr}`] = (Object.values(res.data.records[yr])[v_i][1]/10000000).toFixed(2).toLocaleString('en-IN');
        tableData.rows[v_i][`pct_spent__${yr}`] = Object.values(res.data.records[yr])[v_i][2].toLocaleString('en-IN')+'%';

      }
      })

    })

    console.log('SMRY_TBL_DATA', tableData);

    dispatch({
      type: GET_EXP_SUMMARY_DATA,
      payload: {
        initData,
        vizData,
        lineChrtData,
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

import React, { Component } from "react";
import axios from "axios";

import ReactDOM from 'react-dom';
import { getWeekwiseDates } from '../../utils/functions';
//custom components

import FTooltipSASR from '../../components/atoms/FTooltipSASR';

import FSASRChart from '../../components/dataviz/FSASRChart';
import FBarChart from '../../components/dataviz/FBarChart';
import FTimeSeries from '../../components/dataviz/FTimeSeries';

import * as d3 from "d3";

//sample data
var exp_summary_data = require('../../data/exp-summary.json');

var testData = [
  { date: 0, sanction: 20, addition: 30, savings: 40, revised: 25, mark: 20 },
  { date: 7, sanction: 3000, addition: 300, savings: 400, revised: 2900, mark: 20  },
	{ date: 14, sanction: 3000, addition: 300, savings: 400, revised: 2900, mark: 20 },
  { date: 21, sanction: 3000, addition: 300, savings: 400, revised: 2900, mark: 20 },
  { date: 28, sanction: 3000, addition: 300, savings: 400, revised: 2900, mark: 20 },
  { date: 31, sanction: 3000, addition: 300, savings: 400, revised: 2900, mark: 20 },
]
var myData = [
  {
    name : "name1",
    ary : [
      { date: "jan", receipt: 3000 },
      { date: "feb", receipt: 4000  },
      { date: "mar", receipt: 3000  }
    ]
  },
  {
    name : "name2",
    ary : [
      { date: "jan", receipt: 2000 },
      { date: "feb", receipt: 2000  },
      { date: "mar", receipt: 1000  }
    ]
  }
]




var yymmdd_ref = require("../../data/yymmdd_ref.json");

const Home = (props) =>  {



    const getFilterTest = async () => {
      try{
        const res = await axios.get("http://13.126.189.78/api/acc_heads_desc");
        console.log("getFilterTest");
        console.log(res);
        console.log(res.data.records["01-VIDHAN SABHA"]["2216-HOUSING"]);
        filChildFilters(res, res.data.records["01-VIDHAN SABHA"]["2216-HOUSING"]);
      }catch(err){
        console.log(err);
      }
    }

    const filChildFilters = (res, head = "all" ) => {

      var array_test = [
        [],[],[],[],[],[],[],[],[],[],[],[],[],[]
      ]

      const recurs = (obj, num) => {
        Object.keys(obj).map(key => {
          if(obj[key]){
            if(array_test[num].some(item => item === key) !== true){
              array_test[num].push(key);
            }
            recurs(obj[key], num+1);
          }
        });
      }

      head === "all" ? recurs(res.data.records,0) : recurs(head,0);


      console.log("---------------------------")
      console.log(array_test);
      console.log("---------------------------")
    }

    getFilterTest();

    const initDateFrom = "2018-05-01";
    const initDateTo = "2018-08-31";


    const fromMonthIndex = parseInt(initDateFrom.split("-")[1])-1;
    const toMonthIndex = parseInt(initDateTo.split("-")[1])-1;

    console.log(getWeekwiseDates(fromMonthIndex, toMonthIndex).date_for_x_axis[5])

    return (
      <div>

      <div style={{width:"100%"}}>
          {
          //   <FTimeSeries
          //   dataToX="date"
          //   dataToY="receipt"
          //   dataObj={myData}
          //   dataAryName="ary"
          // />
      }




      </div>
    </div>
    )
  }


export default Home;

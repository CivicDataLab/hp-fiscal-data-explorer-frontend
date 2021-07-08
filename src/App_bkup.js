import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types"
import { Route, Switch } from "react-router-dom";
import axios from "axios";

//redux
import { connect } from "react-redux";

//actions
import { getExpDemandwiseData } from "./actions/exp_demandwise.js"

import MediaQuery from "react-responsive";

//get idb
import { deleteDB, wrap, unwrap } from "idb";
import { openDB } from "idb/with-async-ittr.js";

//from carbon's components
import { Content } from "carbon-components-react/lib/components/UIShell";

//from our components

import FHeader1 from "./components/organisms/FHeader1";
import FHeader2 from "./components/organisms/FHeader2";

//from our content
import Home from "./content/Home";

import AboutUs from "./content/AboutUs";
import ContactUs from "./content/ContactUs";

//test comp
import Idb_test from "./content/Idb_test";

//dictionary to convert exp_details data to objects
import exp_details_keys from "./dictionary/exp_details_keys.json";

import ExpSummary from "./content/ExpSummary";
import ExpDetails from "./content/ExpDetails";
import ExpTracker from "./content/ExpTracker";

import BudgetHighlights from "./content/BudgetHighlights";

import "./App.scss";
var yymmdd_ref = require("./data/yymmdd_ref.json");
var scsr_offset = require("./data/scsr_offset.json");

//initialize all filters with init value
const initExpFilters = { "filters":{} };
const initDateFrom = "2018-04-01";
const initDateTo = "2019-03-31";




 const App = ({ getExpDemandwiseData }) => {
  //set app level state containing raw data.
  const [expData, setExpData] = useState({
                                  vizData : {
                                    data : null ,
                                    yLabelFormat : null,
                                    scsrOffset : null
                                  },
                                  tableData : {
                                  	headers: [],
                                  	rows: []
                                  }
                                });
  const [expDataLoading, setExpDataLoading] = useState(true);

  const getData = async (payload, dateFrom, dateTo) => {

    const { months , years, years_short } = yymmdd_ref;

    console.time("Axios Fetch"); console.log("Axios Fetch Started");


    //calc actual number of days between 2 dates
    var dateFromTime = new Date(dateFrom).getTime();
    var dateToTime = new Date(dateTo).getTime();
    var daysDiff = ((dateToTime - dateFromTime) / (1000 * 3600 * 24)) + 2; //this calcs every day BETWEEN the given 2 dates. So add '2' to correct this


    const month_week = daysDiff > 125 ? "month" : "week"; //give month-wise breakdown if range > 125 days
    const fromMonthIndex = parseInt(dateFrom.split('-')[1])-1;
    const fromYearIndex = years.indexOf(dateFrom.split('-')[0]);

    try {
      const config = { headers: { "content-type": "application/json" } };
      const res = await axios.post(
        `http://13.126.189.78/api/detail_exp_${month_week}?start=${dateFrom}&end=${dateTo}`, payload, config
      );
      console.log("raw data from API: ");
      console.log(res.data.records);
      var tempExpData = [];
      var tempTableData = {
        headers : [],
        rows : []
      };
      var highestRecord = 0;
      res.data.records.map((record, i) => {
        var dataObj = {};
        if(i === 0){ //first we identify highest record to define the 'height of mark' appropriately
          res.data.records.map((record, i) => {
            if(record[0] > highestRecord){
              highestRecord = record[0];
            }
          })
        }

        dataObj.date = month_week === "month" ?
                       months[(i+fromMonthIndex)%12]+" "+years_short[Math.floor((i+fromMonthIndex)/12) + fromYearIndex] :
                       "w_"+(i+1)*7;
        dataObj.sanction = Math.round(record[0]*100)/100;
        dataObj.addition = Math.round(record[1]*100)/100;
        dataObj.savings = Math.round(record[2]*100)/100;
        dataObj.revised = Math.round(record[3]*100)/100;
        dataObj.mark = Math.round((1/100)*highestRecord);
        tempExpData.push(dataObj);
      })

      const calcScsrOffset = (tempExpData) => {
        const noOfDataRecords = tempExpData.length;
        return scsr_offset.xOffset[noOfDataRecords - 1];

      }

      const getYLabelFormatVals = (highestRecord) => {
        const highestRecordLength = Math.floor(highestRecord).toString().length;
        if( highestRecordLength > 5 ){ return [ 100000 , " L "] }
        else if( highestRecordLength < 5 && highestRecordLength > 3 ){ return [ 100 , " K "] }
        else{ return [ 1 , " "] }
      }

      //setup exp details table data
      tempExpData.map((d, i) => {

      	i === 0 && tempTableData.headers.push(
          { key: 'date', header: 'Date' },
          { key: 'sanction', header: 'Sanction' },
          { key: 'addition', header: 'Addition' },
          { key: 'savings', header: 'Savings' },
          { key: 'revised', header: 'Revised' }
        );

      	tempTableData.rows.push({
      		id: i,
      		'date': d.date,
      		'sanction': Math.round(d.sanction*100)/100,
      		'addition': Math.round(d.addition*100)/100,
      		'savings': Math.round(d.savings*100)/100,
      		'revised': Math.round(d.revised*100)/100
      	})
      })

      console.log("highestRecord: " + highestRecord);
      console.log(getYLabelFormatVals(highestRecord)[0]);

      setExpData({
        vizData : {
          yLabelFormat:["", getYLabelFormatVals(highestRecord)[1]+"INR",1/getYLabelFormatVals(highestRecord)[0]],
          data:tempExpData,
          scsrOffset: calcScsrOffset(tempExpData)
        },
        tableData : tempTableData
      });
      setExpDataLoading(false);
      console.log("tableData");
      console.log(tempTableData);

    } catch (err) { console.log(err); }

    console.timeEnd("Axios Fetch");
  };

  useEffect(() => {

    getData(initExpFilters, initDateFrom, initDateTo );
    getExpDemandwiseData(initExpFilters, [initDateFrom, initDateTo]);
  }, []);

  console.log("expData:");
  console.log(expData);

  return (


        <div>
          <FHeader1 />
          <MediaQuery query="(min-device-width: 768px)">
            <FHeader2 />
          </MediaQuery>

          <Content>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/aboutus" component={AboutUs} />
              <Route exact path="/contactus" component={ContactUs} />
              <Route exact path="/expenditure/summary" component={ExpSummary} />
              <Route
                exact
                path="/expenditure/details"
                render={() => (
                  <ExpDetails
                    expData={expData}
                    expDataLoading={expDataLoading}
                    getData={getData}
                    initExpFilters={initExpFilters}
                    initDateFrom={initDateFrom}
                    initDateTo={initDateTo}
                  />
                )}
              />
              <Route exact path="/expenditure/tracker" component={ExpTracker} />
              <Route exact path="/budget_highlights" component={BudgetHighlights} />
              <Route exact path="/idb_test" component={Idb_test} />
            </Switch>
          </Content>
        </div>

  );
}

App.propTypes = {
  exp_demandwise: PropTypes.array.isRequired,
  getExpDemandwiseData : PropTypes.func.isRequired
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, {getExpDemandwiseData})(App);

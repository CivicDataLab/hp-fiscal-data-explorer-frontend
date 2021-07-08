import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types"
import { Route, Switch, withRouter } from "react-router-dom";
import axios from "axios";

//redux
import { connect } from "react-redux";

//actions
import { getExpDemandwiseData } from "./actions/exp_demandwise.js"
import { getExpDemandwiseFiltersData } from './actions/exp_demandwise_filters';

import { getExpDistrictwiseData } from "./actions/exp_districtwise.js"
import { getExpDistrictwiseFiltersData } from './actions/exp_districtwise_filters';

import { getReceiptsData } from "./actions/receipts.js"
import { getReceiptsFiltersData } from './actions/receipts_filters';

import MediaQuery from "react-responsive";

//get idb
import { deleteDB, wrap, unwrap } from "idb";
import { openDB } from "idb/with-async-ittr.js";

//from carbon's components
import { Content } from "carbon-components-react/lib/components/UIShell";

//from our components

import FHeader1 from "./components/organisms/FHeader1";

//from our content
import Home from "./content/Home";

import AboutUs from "./content/AboutUs";
import ContactUs from "./content/ContactUs";

//dictionary to convert exp_details data to objects
import exp_details_keys from "./dictionary/exp_details_keys.json";

import ExpSummary from "./content/ExpSummary";
import ExpDetails from "./content/ExpDetails";
import ExpDistrictwise from "./content/ExpDistrictwise";
import ExpSchemes from "./content/ExpSchemes";
import Receipts from "./content/Receipts";

import BudgetHighlights from "./content/BudgetHighlights";

import "./App.scss";

const App = ({
		exp_demandwise : {
			activeFilters : initExpFilters,
			dateRange : initExpDateRange
		},
		receipts : {
			activeFilters : initReceiptsFilters,
			dateRange : initReceiptsDateRange
		},
		exp_districtwise : {
			initData,
			activeFilters,
			dateRange
		},
		exp_districtwise_filters : {
			allFiltersData,
			rawFilterDataAllHeads
		},
		getExpDemandwiseData,
	  getExpDemandwiseFiltersData,
		getExpDistrictwiseData,
	  getExpDistrictwiseFiltersData,
		getReceiptsData,
	  getReceiptsFiltersData,
		location : { pathname }
	}
) => {


const apiCallQueue = [
	{ apiFunc: () => getExpDemandwiseFiltersData() },
	{ apiFunc: () => getExpDemandwiseData(initExpFilters, [initExpDateRange[0], initExpDateRange[1]]) },
	// { apiFunc: () => getExpDistrictwiseData(initData, activeFilters, dateRange) },
	// { apiFunc: () => getExpDistrictwiseFiltersData(allFiltersData, rawFilterDataAllHeads) }
]

const fetchApisInQueue = async (idx) => {
		await apiCallQueue[idx].apiFunc();
		if(idx+1 !== apiCallQueue.length){
			fetchApisInQueue(idx+1);
		}
}


 useEffect(() => {
	 if(pathname.includes("receipts") === true){
		 apiCallQueue.unshift(
			 { apiFunc: () => getReceiptsData(initReceiptsFilters, initReceiptsDateRange) },
		 	 { apiFunc: () => getReceiptsFiltersData() }
		 )
	 }
	 fetchApisInQueue(0);

 }, []);

 return (
      <div>
        <FHeader1 />
          <Switch>
						<Route exact path="/" component={Home} />
            <Route exact path="/aboutus" component={AboutUs} />
            <Route exact path="/contactus" component={ContactUs} />
            <Route exact path="/expenditure/summary" component={ExpSummary} />
            <Route exact path="/expenditure/details" component={ExpDetails} />
            <Route exact path="/expenditure/tracker" component={ExpDistrictwise} />
						<Route exact path="/schemes" component={ExpSchemes} />
            <Route exact path="/receipts" component={Receipts} />
          </Switch>
      </div>
  );
}

App.propTypes = {
  exp_demandwise : PropTypes.object.isRequired,
	receipts : PropTypes.object.isRequired,
  getExpDemandwiseData : PropTypes.func.isRequired,
  getExpDemandwiseFiltersData : PropTypes.func.isRequired,
	getExpDistrictwiseData : PropTypes.func.isRequired,
  getExpDistrictwiseFiltersData : PropTypes.func.isRequired,
	getReceiptsData : PropTypes.func.isRequired,
  getReceiptsFiltersData : PropTypes.func.isRequired
}

const mapStateToProps = state => ({
	exp_districtwise_filters : state.exp_districtwise_filters,
	exp_districtwise : state.exp_districtwise,
	exp_demandwise : state.exp_demandwise,
	receipts : state.receipts
})

export default withRouter(connect(
	mapStateToProps,
	{
		getExpDistrictwiseData,
		getExpDistrictwiseFiltersData,
		getExpDemandwiseData,
		getExpDemandwiseFiltersData,
		getReceiptsData,
		getReceiptsFiltersData
	})(App));

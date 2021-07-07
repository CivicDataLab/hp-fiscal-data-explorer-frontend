import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import axios from 'axios';

//redux
import { connect } from 'react-redux';

//actions
import { getReceiptsData } from '../../actions/receipts';

import {
	getReceiptsFiltersData,
	updateReceiptsOnFilterChange,
	updateReceiptsOnDateRangeChange } from '../../actions/receipts_filters';

//carbon components
import { Content } from 'carbon-components-react/lib/components/UIShell';
import { ContentSwitcher, Switch } from 'carbon-components-react';

//custom components
import FButton from '../../components/atoms/FButton';
import FLoading from '../../components/atoms/FLoading';
import FBarChart from '../../components/dataviz/FBarChart';
import FTimeSeries from '../../components/dataviz/FTimeSeries';
import FTable from '../../components/dataviz/FTable';
import FDropdown from '../../components/molecules/FDropdown';
import FMonthPicker from '../../components/molecules/FMonthPicker';
import FRadioGroup from '../../components/molecules/FRadioGroup';
import FPageTitle from '../../components/organisms/FPageTitle';

//import helpers
import { convertDataToJson } from '../../utils/functions';

// data_ref
const { receipts: filterOrderRef, receipts_filter_comp } = require('../../data/filters_ref.json');

//Name of components to switch between
const vizTypes = ["FSASR", "FTable"];

const Receipts = ( { receipts : {
											 data : {
												 vizData : { data, xLabelVals, xLabelFormat } ,
												 tableData : { headers, rows }
											 },
											 loading,
											 activeFilters,
											 dateRange
									 },
									 receipts_filters : { allFiltersData, rawFilterData },
									 getReceiptsData,
									 updateReceiptsOnFilterChange,
									 updateReceiptsOnDateRangeChange,
									 getReceiptsFiltersData
								   } ) => {

	//declare the components that need to be dynamically generated
	const Components = { FDropdown };

	//initialize useState hook
	const [currentVizType, setCurrentVizType] = useState(vizTypes[0]);
	const switchVizType = (e) => { setCurrentVizType(vizTypes[e]); }



	useEffect(() => {
		getReceiptsData(activeFilters, dateRange);
		getReceiptsFiltersData();
  }, []);

	const onRadioChange = (value, name) => {
		console.log(value + "," + name);
		onFilterChange({selectedItem:{filter_name:name,id:value}});
  }

	const onFilterChange = (e) => {
		updateReceiptsOnFilterChange(e, activeFilters, allFiltersData, rawFilterData, dateRange);
	}

	const onDateRangeSet = (newDateRange) => {
		updateReceiptsOnDateRangeChange(newDateRange, activeFilters);
	}

	const createDataUIComponent = () => {
		if(loading === true){
			return <FLoading />;
		}else{
			return (
				<Fragment>
					<div className="content-switcher-wrapper">
						<ContentSwitcher onChange={switchVizType} >
							<Switch  text="Visual" />
							<Switch  text="Table" />
						</ContentSwitcher>
					</div>
					{ currentVizType === vizTypes[0] ?
							<FBarChart
								data={data}
								dataToX="date"
								dataPoints={["receipt"]}
								xLabelVals={xLabelVals}
								xLabelFormat={xLabelFormat}
								/> :
						 <Fragment>
							 <FTable
								 rows={rows}
								 headers={headers}
								 onClickDownloadBtn={(e) => { console.log(e)}}
								 />
						 </Fragment>
				 	 }
				</Fragment>
			)
		}
	}

	return (
		<div className="f-content">
			<FPageTitle
				pageTitle="Receipts"
				showLegend={false}
				monthPicker={
					<FMonthPicker
						defaultSelect = {{
							years:[ parseInt(dateRange[0].split('-')[0]), parseInt(dateRange[1].split('-')[0]) ],
							months:[ parseInt(dateRange[0].split('-')[1]), parseInt(dateRange[1].split('-')[1]) ] }}
						dateRange = {{years:[2018, 2019], months:[4, 3]}}
						onDateRangeSet={onDateRangeSet}
					/>
				}
				/>
      <div className="data-viz-col receipts">
				{createDataUIComponent()}
      </div>
			<div className="filter-col-wrapper">
        <div className="filter-col">


						<FDropdown
						className = "filter-col--ops"
						titleText = "Major"
						label = "All"
						onChange = {onFilterChange}
						items = {allFiltersData[0] && allFiltersData[0].val}
						selectedItem = { activeFilters && activeFilters.filters.major ? activeFilters.filters.major : "All" }
					/>
					<FDropdown
						className = "filter-col--ops"
						titleText = "Sub Major"
						label = "All"
						onChange = {onFilterChange}
						items = {allFiltersData[1] && allFiltersData[1].val}
						selectedItem = { activeFilters && activeFilters.filters.sub_major ? activeFilters.filters.sub_major : "All" }

					/>
					<FDropdown
						className = "filter-col--ops"
						titleText = "Minor"
						label = "All"
						onChange = {onFilterChange}
						items = {allFiltersData[2] && allFiltersData[2].val}
						selectedItem = { activeFilters && activeFilters.filters.minor ? activeFilters.filters.minor : "All" }
					/>
					<FDropdown
						className = "filter-col--ops"
						titleText = "Sub Minor"
						label = "All"
						onChange = {onFilterChange}
						items = {allFiltersData[3] && allFiltersData[3].val}
						selectedItem = { activeFilters && activeFilters.filters.sub_minor ? activeFilters.filters.sub_minor : "All" }
					/>


        </div>
			</div>
    </div>
	)
}

Receipts.propTypes = {
	receipts : PropTypes.object.isRequired,
	receipts_filters : PropTypes.object.isRequired,
	getReceiptsData : PropTypes.func.isRequired,
	updateReceiptsOnFilterChange : PropTypes.func.isRequired,
	updateReceiptsOnDateRangeChange : PropTypes.func.isRequired,
	getReceiptsFiltersData : PropTypes.func.isRequired
}

const mapStateToProps = state => ({
	receipts : state.receipts,
	receipts_filters : state.receipts_filters
})

export default connect(mapStateToProps, { getReceiptsData, getReceiptsFiltersData, updateReceiptsOnFilterChange, updateReceiptsOnDateRangeChange })(Receipts);

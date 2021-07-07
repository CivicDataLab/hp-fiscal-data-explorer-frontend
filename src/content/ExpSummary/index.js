import React, { Component, useState, useEffect, Fragment } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//actions
import { getExpSummaryData } from '../../actions/exp_summary';

//carbon components
import { Content } from 'carbon-components-react/lib/components/UIShell';
import { ContentSwitcher, Switch } from 'carbon-components-react';
import { Button } from 'carbon-components-react';

//custom components
import FLoading from '../../components/atoms/FLoading';
import FTable from '../../components/dataviz/FTable';
import FSlope from '../../components/dataviz/FSlope';
import FFilterColumn2 from '../../components/organisms/FFilterColumn2';

import FForce_Y from '../../components/dataviz/FForce_Y';
import FForce_X from '../../components/dataviz/FForce_X';
import FPageTitle from '../../components/organisms/FPageTitle';
import FLegendBar from '../../components/atoms/FLegendBar';
import FRadioGroup from '../../components/molecules/FRadioGroup';
import FTimeSeries from '../../components/dataviz/FTimeSeries';
import FDropdown from '../../components/molecules/FDropdown';

//data
import howToUseContent from '../../data/howToUseContent.json';

import FPageMeta from '../../components/organisms/FPageMeta';

//Name of components to switch between
const vizTypes = ["FForce", 'FLineChart', "FTable"];

 // const lineChrtData = [
	// 	{
	// 		name : "name1", //optional
	// 		exp_alloc : 'allocated',
	// 		yearwise : [
	// 			{ year : "2017" , amount : 0},
	// 			{ year : "2018" , amount : 3},
	// 			{ year : "2019" , amount : 2},
	// 			{ year : "2020" , amount : 1}
	// 		]
	// 	},
	// 	{
	// 		name : "name2", //optiona;
	// 		exp_alloc : 'expenditure',
	// 		yearwise : [
	// 			{ date : "2017" ,  amount : 3},
	// 			{ date : "2018" , amount : 1},
	// 			{ date : "2019" , amount : 4},
	// 			{ date : "2020" , amount : 1}
	// 		]
	// 	}
	// ]
 //...


const ExpSummary = ({
	exp_summary : {
		loading,
		vizData,
		lineChrtData,
		tableData : { rows, headers}
	},
	getExpSummaryData
 }) => {

	const [currentVizType, setCurrentVizType] = useState(vizTypes[0]);
	const switchVizType = (e) => { setCurrentVizType(vizTypes[e.index]); }

	const [activeDataPoint, setActiveDataPoint] = useState('alloc');
	const [activeVizData, setActiveVizData] = useState([]);

	const [activeDemandForTimeseries, setActiveDemandForTimeseries] = useState('All Demands');
	const handleChangeActiveDemandForTimeSeries = v => setActiveDemandForTimeseries(v.selectedItem);

	const handleDataPointChange = (value,name) => {
		setActiveDataPoint(value);
		console.log('value',value)
		setActiveVizData(populateActiveVizData(value));
	}

	const genDemandSelector = () => (
		<FDropdown
			initialSelectedItem = {activeDemandForTimeseries}
			items = { Object.keys(lineChrtData) }
			onChange = {(v) => handleChangeActiveDemandForTimeSeries(v)}
			/>
	)

	const populateActiveVizData = (activeProperty) => {
		let tempData = [];
		vizData.map(d => {
			let dataObj = {};
			dataObj.demand = d.demand;
			dataObj.demand_description = d.demand_description;
			dataObj.pct_change = d[activeProperty].pct_change;
			dataObj.current = d[activeProperty].current;
			dataObj.previous = d[activeProperty].previous;
			tempData.push(dataObj)
		})
		return tempData;
	}

	useEffect(() => {
		if(vizData.length > 0){
			setActiveVizData(populateActiveVizData('alloc'));
		}

	},[vizData])

	const genTimeSeries = () => (
		<Fragment>
			<FTimeSeries
				dataToX="year"
				dataToY={"amount"}
				data={lineChrtData[activeDemandForTimeseries]}
				dataAryName="yearwise"
				
				xLabelFormat={lineChrtData['All Demands'][0].yearwise.map(obj => obj.year)}
				lineLabel="exp_alloc"
			/>
		</Fragment>
	)

	const createDataUIComponent = () => {
		if(loading === true){
			return <FLoading/>
		}else{
			return (
				<Fragment>
					<div className="content-switcher-wrapper">
            <ContentSwitcher onChange={switchVizType} selectedIndex={vizTypes.indexOf(currentVizType)} >
              <Switch  text="Bubble Chart" />
              <Switch  text="Timeseries" />
							<Switch  text="Table" />
            </ContentSwitcher>
          </div>
					{
						currentVizType === vizTypes[0] ?
						<Fragment>
							<FLegendBar
								vizType='bubble'
								data={[
									{key: 'The bigger the size of the circle the bigger is the amount', type: 'bubble', color: 'black'}
								]}
								/>
							<FRadioGroup
								className = "viz-view-toggle"
								name = "FSmryDataPointSwitcher"
								titleText = "View:"
								onChange = {(value, name) => handleDataPointChange(value, name)}
								items = {[
									{ label : "Allocated", id : "alloc" },
									{ label : "Expenditure", id : "exp" },
								]}
								valueSelected = {activeDataPoint}
							/>
						<div id="data_viz_wrapper" className="data-viz-wrapper">
								<FForce_X
									nodes={activeVizData && activeVizData}
									activeDataPoint = {activeDataPoint}
									/>
								{/* <FForce_Y nodes={this.props.exp_summary.data} />*/}
							</div>
						</Fragment>
						:
						currentVizType === vizTypes[1] ?
						<Fragment>{genTimeSeries()}</Fragment>
						:
						<FTable rows={rows} headers={headers} />
					}
				</Fragment>
			)
		}
	}

    return (
      <div className={`f-content exp-summary-content`}>
				<FPageMeta pageId = 'expenditure_summary' />
				<FPageTitle
					pageTitle={ <span>Expenditure | Summary  <span className="f-light-grey">{`| FY: ${vizData.length > 0 && vizData[0].curr_year.split('_').join(' - ')}`}</span></span> }
					pageDescription= {howToUseContent[0].content.body}
					showLegend={ true }
					/>
        <div className={`data-viz-col exp-summary ${currentVizType === vizTypes[1] ? 'timeseries-is-active' : ''}`}>
          {createDataUIComponent()}
        </div>
			{ currentVizType === vizTypes[1] &&
				<div className={`filter-col-wrapper`}>
					<FFilterColumn2
	          customComp = {<div>{genDemandSelector()}</div>}
	          />
				</div> }
      </div>
    );

}

ExpSummary.propTypes = {
  exp_summary: PropTypes.object.isRequired,
  getExpSummaryData: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  exp_summary: state.exp_summary
})


export default connect(mapStateToProps, { getExpSummaryData })(ExpSummary);

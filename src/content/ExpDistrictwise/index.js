import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
//redux
import { connect } from 'react-redux';

//carbon components
import { ContentSwitcher, Switch } from 'carbon-components-react';
import { MultiSelect } from 'carbon-components-react';

//custom components
import FLoading from '../../components/atoms/FLoading';
import FPageTitle from '../../components/organisms/FPageTitle';
import FMonthPicker from '../../components/molecules/FMonthPicker';

import FMap from '../../components/dataviz/FMap';
import FBarChart from '../../components/dataviz/FBarChart';
import FTimeSeries from '../../components/dataviz/FTimeSeries';
import FTable from '../../components/dataviz/FTable';

import FRadioGroup from '../../components/molecules/FRadioGroup';

import FFilterColumn2 from '../../components/organisms/FFilterColumn2';

import FTooltipDistrictsAndSchemes from '../../components/atoms/FTooltipDistrictsAndSchemes';

//actions
import { getExpDistrictwiseData, setActiveVizIdx, resetActiveFiltersAndDateRange }  from '../../actions/exp_districtwise';
import { getExpDistrictwiseFiltersData, updateExpDistrictwiseFilters, updateDistrictwiseOnDateRangeChange }  from '../../actions/exp_districtwise_filters';

var { exp_districtwise : filterOrderRef, districtwise_filter_comp } = require("../../data/filters_ref.json");

//Name of components to switch between
const vizTypes = ["FMap", "FBarChart", "FTimeSeries", "FTable"];


const ExpDistrictwise = ({
  exp_districtwise : {
    initData,
    data : {
      mapData,
      barChrtData : { data: barChrtData },
      lineChrtData : { data: lineChrtData, xLabelVals, xLabelFormat },
      tableData : { headers, rows }
    },
    loading,
    activeVizIdx,
    activeFilters,
    dateRange
  },
  exp_districtwise_filters : { allFiltersData, rawFilterDataAllHeads, loading : filtersLoading },
  getExpDistrictwiseData,
  setActiveVizIdx,
  getExpDistrictwiseFiltersData,
  resetActiveFiltersAndDateRange,
  updateDistrictwiseOnDateRangeChange,
  updateExpDistrictwiseFilters }) => {

  //handle filter bar responsiveness
  const [filterBarVisibility, setFilterBarVisibility] = useState(false);
	const handleFilterBarVisibility = () => {
		setFilterBarVisibility(!filterBarVisibility);
	}

  const activeViz = vizTypes[activeVizIdx];

  const switchActiveViz = (e) => { setActiveVizIdx(e) };
  // const [activeViz, setActiveViz] = useState(vizTypes[0]);
  const [activeVizView, setActiveVizView] = useState({
    FTimeSeriesVizView : "gross",
    FMapVizView : "gross"
  });

  console.log(activeVizView.FTimeSeriesVizView);

  useEffect(() => {
    getExpDistrictwiseData(initData, activeFilters, dateRange);
    getExpDistrictwiseFiltersData(allFiltersData, rawFilterDataAllHeads);

    return () => {
      resetActiveFiltersAndDateRange();
    };

  }, []);

  const clearAllSelectedOptions = (filterName) => {
    document
      .querySelectorAll(`.f-${filterName}-multiselect .bx--list-box__selection--multi`)
      .forEach(e => e.click());
  }

  const onViewChange = (value, name) => {
    setActiveVizView({
      ...activeVizView,
      [name] : value
    });
  }

  const onFilterChange = (e, key) => {
    //if at least 1 option is selected,
    if(e.selectedItems.length > 0){
      activeFilters[key] = e.selectedItems.map(selectedItem => {
        return selectedItem.id;
      })
    }else{ delete activeFilters[key]; }
    //remove all child filters from activeFiltersArray
    const currFilterOrderIndex = filterOrderRef.indexOf(key);
    filterOrderRef.map((filterName,i) => {
      if(i > currFilterOrderIndex && activeFilters[filterName] ){
        delete activeFilters[filterName];
        clearAllSelectedOptions(filterName);
      }
    })

    console.log("activeFilters");
    console.log(activeFilters);
    getExpDistrictwiseData(initData, activeFilters, dateRange);
    updateExpDistrictwiseFilters(e, key, activeFilters, allFiltersData, rawFilterDataAllHeads);
	}


  const onDateRangeSet = (newDateRange) => {
		updateDistrictwiseOnDateRangeChange(initData, newDateRange, activeFilters);
	}



  const renderSwitch = () => {
    switch (activeViz) {
      case 'FMap':
      return <div id="fmap">
              <FMap
                data={mapData}
                dataPointToMap={activeVizView.FMapVizView}
                />
             </div>;

      case 'FBarChart':
      return <FBarChart
              data={barChrtData}
              dataToX="districtName"
              dataPoints={["gross", "netPayment"]}
              barColors={["darkGrey", "black"]}
              xLabelVals={xLabelVals}
              yAxisLabel="total amount in rupees"
              xAxisLabel="districts"
              tooltip={<FTooltipDistrictsAndSchemes activeDataPoint={["gross", "netPayment"]}/>}
              />;

      case 'FTimeSeries':
      return  <Fragment>
                <FTimeSeries
                  dataToX="date"
                  dataToY={activeVizView.FTimeSeriesVizView}
                  data={lineChrtData}
                  dataAryName="datewiseExp"
                  xLabelVals={xLabelVals}
  								xLabelFormat={xLabelFormat}
                  tooltip={<FTooltipDistrictsAndSchemes vizType={vizTypes[activeVizIdx]} activeDataPoint={[activeVizView]} totalTicks={lineChrtData[0].datewiseExp.length}/>}
                />
              </Fragment>

      case 'FTable':
      return <FTable
              rows={rows}
              headers={headers}
              onClickDownloadBtn={(e) => { console.log(e)}}
              />

      default:
      return <div>nothing to display</div>;
    }
  }

  const createDataUIComponent = () => {
		if(loading === true){
			return <FLoading />;
		}else{
			return (
				<Fragment>
					<div className="content-switcher-wrapper">
            <ContentSwitcher onChange={switchActiveViz} selectedIndex={activeVizIdx} >
              <Switch  text="Map" />
              <Switch  text="Bar Chart" />
              <Switch  text="Time Series" />
              <Switch  text="Table" />
            </ContentSwitcher>
					</div>
          { activeViz === 'FTimeSeries' &&
            <FRadioGroup
              className = "viz-view-toggle"
              name = "FTimeSeriesVizView"
              titleText = "View:"
              onChange = {(value, name) => onViewChange(value, name)}
              items = {[
                { label : "Gross", id : "gross" },
                { label : "Net Payment", id : "netPayment" },
                { label : "Both", id : "gross,netPayment" }

              ]}
              valueSelected = {activeVizView.FTimeSeriesVizView}

            />
          }
          { activeViz === 'FMap' &&
            <FRadioGroup
              className = "viz-view-toggle"
              name = "FMapVizView"
              titleText = "View:"
              onChange = {(value, name) => onViewChange(value, name)}
              items = {[
                { label : "Gross", id : "gross" },
                { label : "Net Payment", id : "netPayment" },
              ]}
              valueSelected = {activeVizView.FMapVizView}
            />
          }
					{ renderSwitch() }
				</Fragment>
			)
		}
	}

  return (
    <div className="f-content">
      <FPageTitle
        pageTitle="Expenditure | Districtwise"
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
      <div className="data-viz-col exp-districtwise">
        {createDataUIComponent()}
      </div>
      <div className={`filter-col-wrapper ${filterBarVisibility === true ? "show" : "hide"}`}>
        <FFilterColumn2
          allFiltersData = {allFiltersData && allFiltersData}
          filterCompData = {districtwise_filter_comp}
          filtersLoading = {filtersLoading}
          activeFilters = {activeFilters}
          onChange = {(e, key) => onFilterChange(e, key)}
          onFilterIconClick={handleFilterBarVisibility}
          />
      </div>
    </div>
  )

}

ExpDistrictwise.propTypes ={
  exp_districtwise : PropTypes.object.isRequired,
  exp_districtwise_filters : PropTypes.object.isRequired,
  getExpDistrictwiseData : PropTypes.func.isRequired,
  setActiveVizIdx : PropTypes.func.isRequired,
  getExpDistrictwiseFiltersData : PropTypes.func.isRequired,
  resetActiveFiltersAndDateRange : PropTypes.func.isRequired,
  updateExpDistrictwiseFilters : PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  exp_districtwise : state.exp_districtwise,
  exp_districtwise_filters : state.exp_districtwise_filters
})

export default connect(
  mapStateToProps,
  { getExpDistrictwiseData,
    setActiveVizIdx,
    getExpDistrictwiseFiltersData,
    resetActiveFiltersAndDateRange,
    updateDistrictwiseOnDateRangeChange,
    updateExpDistrictwiseFilters
  }
)(ExpDistrictwise);

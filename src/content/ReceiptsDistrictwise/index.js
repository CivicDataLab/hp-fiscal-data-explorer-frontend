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
import FTooltipReceipts from '../../components/atoms/FTooltipReceipts';
import FLegendBar from '../../components/atoms/FLegendBar';

import FPageMeta from '../../components/organisms/FPageMeta';

//actions
import { getReceiptsDistrictwiseData, setActiveVizIdx, resetActiveFiltersAndDateRange }  from '../../actions/receipts_districtwise';
import { getReceiptsDistrictwiseFiltersData, updateReceiptsDistrictwiseFilters, updateReceiptsDistrictwiseOnDateRangeChange }  from '../../actions/receipts_districtwise_filters';

//data
import howToUseContent from '../../data/howToUseContent.json';
var { receipts_districtwise : filterOrderRef, receipts_districtwise_filter_comp } = require("../../data/filters_ref.json");

//Name of components to switch between
const vizTypes = ["FMap", "FBarChart", "FTimeSeries", "FTable"];


const ReceiptsDistrictwise = ({
  receipts_districtwise : {
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
  receipts_districtwise_filters : { allFiltersData, rawFilterDataAllHeads, loading : filtersLoading },
  getReceiptsDistrictwiseData,
  setActiveVizIdx,
  getReceiptsDistrictwiseFiltersData,
  resetActiveFiltersAndDateRange,
  updateReceiptsDistrictwiseOnDateRangeChange,
  updateReceiptsDistrictwiseFilters }) => {

  let receiptsDistrictwiseActiveFilters = {...activeFilters};
  //handle filter bar responsiveness
  const [filterBarVisibility, setFilterBarVisibility] = useState(false);
	const handleFilterBarVisibility = () => {
		setFilterBarVisibility(!filterBarVisibility);
	}

  const activeViz = vizTypes[activeVizIdx];

  const switchActiveViz = (e) => {
    setActiveVizIdx(e.index)
  };




  useEffect(() => {
    // getReceiptsDistrictwiseData(initData, activeFilters, dateRange);
    // getReceiptsDistrictwiseFiltersData(allFiltersData, rawFilterDataAllHeads);

    return () => {
      // resetActiveFiltersAndDateRange();
    };

  }, []);

  const clearAllSelectedOptions = (filterName) => {
    document
      .querySelectorAll(`.f-${filterName}-multiselect .bx--list-box__selection--multi`)
      .forEach(e => e.click());
  }

  const onFilterChange = (e, key) => {
    //if at least 1 option is selected,
    if(e.selectedItems.length > 0){
      receiptsDistrictwiseActiveFilters[key] = e.selectedItems.map(selectedItem => {
        return selectedItem.id;
      })
    }else{ delete receiptsDistrictwiseActiveFilters[key]; }
    //remove all child filters from activeFiltersArray
    const currFilterOrderIndex = filterOrderRef.indexOf(key);
    filterOrderRef.map((filterName,i) => {
      if(i > currFilterOrderIndex && receiptsDistrictwiseActiveFilters[filterName] ){
        delete receiptsDistrictwiseActiveFilters[filterName];
        clearAllSelectedOptions(filterName);
      }
    })

    getReceiptsDistrictwiseData(initData, receiptsDistrictwiseActiveFilters, dateRange);
    updateReceiptsDistrictwiseFilters(e, key, receiptsDistrictwiseActiveFilters, allFiltersData, rawFilterDataAllHeads);
	}


  const onDateRangeSet = (newDateRange) => {
		updateReceiptsDistrictwiseOnDateRangeChange(initData, newDateRange, receiptsDistrictwiseActiveFilters);
	}



  const renderSwitch = () => {
    switch (activeViz) {
      case 'FMap':
      return (
        <Fragment>
          <FLegendBar
            vizType='map'
            data={
              {key: ['Lowest' ,'Highest'], type: 'gradient', color: ["hsl(177,100%,0%)", "hsl(177,100%,70%)"]}
            }
            />
          <div id="fmap">
            <FMap
              data={mapData}
              dataPointToMap={'receipt'}
              />
           </div>
         </Fragment>
      )

      case 'FBarChart':
      return (
        <Fragment>
        <FLegendBar
          vizType='bar'
          data={[
            {key: 'Receipt', type: 'bar', color: 'darkGrey'}
          ]}
          />
        <FBarChart
              data={barChrtData}
              dataToX="districtName"
              dataPoints={["receipt"]}
              barColors={["darkGrey", "black"]}
              xLabelVals={xLabelVals}
              yAxisLabel="total amount in rupees"
              xAxisLabel="districts"
              tooltip={<FTooltipReceipts/>}
              />
        </Fragment>
      )

      case 'FTimeSeries':
      return  <Fragment>
                <FTimeSeries
                  dataToX="date"
                  dataToY={'receipt'}
                  data={lineChrtData}
                  dataAryName="datewiseRec"
                  xLabelVals={xLabelVals}
  								xLabelFormat={xLabelFormat}
                  tooltip={<FTooltipReceipts/>}
                  lineLabel="districtName"
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
					{ renderSwitch() }
				</Fragment>
			)
		}
	}

  return (
    <div className="f-content">
      <FPageMeta pageId = 'receipts_districtwise' />
      <FPageTitle
        pageTitle="Receipts | Districtwise"
        pageDescription= {howToUseContent[4].content.body}
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
          section = 'receipts_districtwise'
          allFiltersData = {allFiltersData && allFiltersData}
          filterCompData = {receipts_districtwise_filter_comp}
          filtersLoading = {filtersLoading}
          activeFilters = {receiptsDistrictwiseActiveFilters}
          onChange = {(e, key) => onFilterChange(e, key)}
          onFilterIconClick={handleFilterBarVisibility}
          />
      </div>
    </div>
  )

}

ReceiptsDistrictwise.propTypes ={
  receipts_districtwise : PropTypes.object.isRequired,
  receipts_districtwise_filters : PropTypes.object.isRequired,
  getReceiptsDistrictwiseData : PropTypes.func.isRequired,
  setActiveVizIdx : PropTypes.func.isRequired,
  getReceiptsDistrictwiseFiltersData : PropTypes.func.isRequired,
  resetActiveFiltersAndDateRange : PropTypes.func.isRequired,
  updateReceiptsDistrictwiseOnDateRangeChange : PropTypes.func.isRequired,
  updateReceiptsDistrictwiseFilters : PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  receipts_districtwise : state.receipts_districtwise,
  receipts_districtwise_filters : state.receipts_districtwise_filters
})

export default connect(
  mapStateToProps,
  { getReceiptsDistrictwiseData,
    setActiveVizIdx,
    getReceiptsDistrictwiseFiltersData,
    resetActiveFiltersAndDateRange,
    updateReceiptsDistrictwiseOnDateRangeChange,
    updateReceiptsDistrictwiseFilters
  }
)(ReceiptsDistrictwise);

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
import FForce from '../../components/dataviz/FForce';
import FForce_Y from '../../components/dataviz/FForce_Y';
import FForce_X from '../../components/dataviz/FForce_X';
import FPageTitle from '../../components/organisms/FPageTitle';

//Name of components to switch between
const vizTypes = ["FForce", "FTable"];


const ExpSummary = ({
	exp_summary : {
		loading,
		vizData,
		tableData : { rows, headers}
	},
	getExpSummaryData
 }) => {

	const [currentVizType, setCurrentVizType] = useState(vizTypes[0]);
	const switchVizType = (e) => { setCurrentVizType(vizTypes[e]); }

	useEffect(() => {
		getExpSummaryData();
	},[])

	const createDataUIComponent = () => {
		if(loading === true){
			return <FLoading/>
		}else{
			return (
				<Fragment>
					<div className="content-switcher-wrapper">
            <ContentSwitcher onChange={switchVizType} selectedIndex={vizTypes.indexOf(currentVizType)} >
              <Switch  text="Visual" />
              <Switch  text="Table" />
            </ContentSwitcher>
          </div>
					{
						currentVizType === vizTypes[0] ?
						<div className="data-viz-wrapper">
							<FForce_X nodes={vizData} />
							{/* <FForce_Y nodes={this.props.exp_summary.data} />*/}
						</div>
						:
						<FTable rows={rows} headers={headers} />
					}
				</Fragment>
			)
		}
	}

    return (
      <div className="f-content exp-summary-content">
				<FPageTitle
					pageTitle={ <span>Expenditure | Summary  <span className="f-light-grey">| FY: 2018-19</span></span> }
					pageDescription= "Carbon is IBM’s open-source design system for digital
					 			products and experiences. With the IBM Design Language
					 			as its foundation, the system consists of working code,
					 			design tools and resources, human interface guidelines,
					 			and a vibrant community of contributors."
					showLegend={ true }
					/>
        <div className="data-viz-col exp-summary">
          {createDataUIComponent()}
        </div>
        <div>
        </div>
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

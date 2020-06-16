import React, { Component } from "react";
import axios from 'axios';

//carbon components
import { Content } from 'carbon-components-react/lib/components/UIShell';
import { ContentSwitcher, Switch } from 'carbon-components-react';
import { Button } from 'carbon-components-react';

//custom components
import FTable from '../../components/dataviz/FTable';
import FBarChart from '../../components/dataviz/FBarChart';

//sample bar data
const sampleDataBar = [
  { month: "Jan", sanction: 3000 },
  { month: "Feb", sanction: 3000 },
  { month: "Mar", sanction: 3000 },
  { month: "Apr", sanction: 3000 },
  { month: "May", sanction: 3000 },
  { month: "Jun", sanction: 3000 },
  { month: "Jul", sanction: 3000 },
  { month: "Aug", sanction: 3000 },
  { month: "Sep", sanction: 3000 },
  { month: "Oct", sanction: 3000 },
  { month: "Nov", sanction: 3000 },
  { month: "Dec", sanction: 3000 }
]

//sample table data
const sampleRows = [{
		id: 'a',
		demand_code: '1',
		sanction: '1000',
		percent_change: '10%',
  },
	{
		id: 'b',
		demand_code: '2',
		sanction: '800',
		percent_change: '12%'
  },
	{
		id: 'c',
		demand_code: '3',
		sanction: '1200',
		percent_change: '6%'
  },
];
const sampleHeaders = [
  {
		key: 'demand_code', // `key` is the name of the field on the row object itself for the header
		header: 'Demand', // `header` will be the name you want rendered in the Table Header
  },
	{
		key: 'sanction',
		header: 'Sanction',
  },
	{
		key: 'percent_change',
		header: 'Pecentage Change Since Last Year',
  },
];

//Name of components to switch between
const sec1VizTypes = ["FBar", "FTable"];

const props = {
  FBarChart: {
    data: sampleDataBar,
    dataToX: 'month',
    dataPoints: ['sanction']
  },

	FTable: {
		rows: sampleRows,
		headers: sampleHeaders
	}
}

class BudgetHighlights extends Component {

	constructor(props) {
		super(props);

		this.state = {
      currentSec1VizType: sec1VizTypes[0],
    };
		this.switchSec1VizType = this.switchSec1VizType.bind(this);
	}

  async getData(apiUrl){
    try{
      const res = await axios.get(apiUrl);
      console.log(res);
    }catch(err){
      console.log(err);
    }
  }

	switchSec1VizType(e) {
		this.setState({ currentSec1VizType: sec1VizTypes[e] })
	}

  componentDidMount() {
    // this.getData("https://hpback.openbudgetsindia.org/api/exp_summary");
}

	render() {

		var currentSec1VizComp;
		this.state.currentSec1VizType === sec1VizTypes[0] ?
			currentSec1VizComp = <FBarChart {...props.FBarChart}  /> :
			currentSec1VizComp = <FTable {...props.FTable}  />;

		return (
			<div className="exp-summary-content">
        <div className="text-col">
          <h3>Budget Highlights</h3>
          <p>
            Some text summarizing budget highlights
          </p>
        </div>
        <div className="data-viz-col exp-summary">
          <div className="content-switcher-wrapper">
            <ContentSwitcher onChange={this.switchSec1VizType} >
              <Switch  text="Bar Chart" />
              <Switch  text="Table" />
            </ContentSwitcher>
          </div>
          {currentSec1VizComp}
        </div>
        <div>

        </div>
      </div>
		)
	}
}
export default BudgetHighlights;

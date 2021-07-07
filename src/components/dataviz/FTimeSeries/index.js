//HOW TO USE:

//1 import FTimeChart into which ever component you wanna use this in.
//2 data should be of the format:
// [
//  const sampleData : [
	// 	{
	// 		name : "name1", //optional
	// 		dataAry : [
	// 			{ date : " " , gross : 0},
	// 			{ date : "Aug" , gross : 3},
	// 			{ date : "Sep" , gross : 2},
	// 			{ date : "Oct" , gross : 1}
	// 		]
	// 	},
	// 	{
	// 		name : "name2", //optiona;
	// 		dataAry : [
	// 			{ date : " " ,  gross : 3},
	// 			{ date : "Aug" , gross : 1},
	// 			{ date : "Sep" , gross : 4},
	// 			{ date : "Oct" , gross : 1}
	// 		]
	// 	}
	// ]
//  ...
// ]
//3 considering the above dataset as an example, following props are required (along with values):
// data = sampleData (ary)
// dataToX = "gross" (string)
// dataToY = "date" (string)
//dataAryName = "dataAry" (string)


import React, { Component, Fragment} from "react";
import {
	VictoryLine,
	VictoryChart,
	VictoryAxis,
	VictoryArea,
	VictoryGroup,
	VictoryLabel,
	VictoryTheme,
	VictoryTooltip,
	VictoryVoronoiContainer
} from 'victory';

import { getDynamicYLabelFormat } from '../../../utils/functions';

import sassVars from '../../../scss/_vars.scss'

const fColorScale = [
	"hsl(360, 100%, 50%)",
	"hsl(340, 100%, 50%)",
	"hsl(320, 100%, 50%)",
	"hsl(300, 100%, 50%)",
	"hsl(280, 100%, 50%)",
	"hsl(260, 100%, 50%)",
	"hsl(240, 100%, 50%)",
	"hsl(220, 100%, 50%)",
	"hsl(200, 100%, 50%)",
	"hsl(180, 100%, 50%)",
	"hsl(160, 100%, 50%)",
	"hsl(140, 100%, 50%)",
	"hsl(120, 100%, 50%)",
	"hsl(100, 100%, 50%)"
]

const tickLabelStyle = {
  fontFamily: 'IBM Plex Sans',
  fontSize: '7px',
  fontWeight: 600
  }

const axisLabelStyle ={
  padding: 40,
  fontFamily: 'IBM Plex Sans',
  fontSize: '7px',
  fill: "rgb(37, 37, 37)",
  fontWeight: 400,
  textTransform: "uppercase",
  wordSpacing: "0.2em",
  letterSpacing: "0.08em"
}


class FTimeSeries extends Component {

  static defaultProps = {
			chartWidth: 700,
      chartHeight: 700
   };

  render() {
    return (
      <VictoryChart
				theme={VictoryTheme.material}
        width= {this.props.chartWidth}
        height= {this.props.chartHeight}
				padding={{ top: 50, bottom: 450, left: 50, right: 120 }}
				containerComponent={
		      <VictoryVoronoiContainer
		        labels={datum => datum}
						labelComponent={this.props.tooltip}
		      />
		    }
      >
      <VictoryAxis
				label={this.props.xAxisLabel}
				style={{ axisLabel: axisLabelStyle }}
        tickLabelComponent={
          <VictoryLabel
            dx={0}
						dy={0}
            style={tickLabelStyle}
						textAnchor="end"
						angle={-45}
          />
        }
        tickFormat={this.props.xLabelFormat}
        tickValues={this.props.xLabelVals}
      />
      <VictoryAxis
        dependentAxis
				label={this.props.yAxisLabel}
				style={{ axisLabel: axisLabelStyle }}
        tickLabelComponent={
          <VictoryLabel
            dx={0}
            style={tickLabelStyle}
						angle={-45}
          />
        }
        tickFormat={(y) => getDynamicYLabelFormat(y)}
      />
        <VictoryGroup
          style={{ data: { width: 5 } }}

        >
        {
          this.props.data && //if multiple datapoints is specified via the datapoints prop,
            this.props.data.map((d, i) =>{
							const data = d[this.props.dataAryName];
								return(
	                <VictoryLine
	                  key={i}
	                  colorScale={fColorScale}
	                  data={d[this.props.dataAryName]}
	                  x={this.props.dataToX}
	                  y={this.props.dataToY.split(',')[0]}
										labels={ ({datum}) => datum.idx === data.length-1 ? d[this.props.lineLabel] : ""}
										style={{ labels: { ...tickLabelStyle, textAnchor:"initial", alignmentBaseline:"hanging" } }}
	                />
	              )
            })
        }
				{
					(this.props.data && this.props.dataToY.split(',').length > 1) &&
						 this.props.data.map((d,i) => {
							 return (
								 <VictoryLine
									 key={i}
									 colorScale={fColorScale}
									 data={d[this.props.dataAryName]}
									 style={{ data: { strokeWidth: 3} }}
									 x={this.props.dataToX}
									 y={this.props.dataToY.split(',')[1].trim()}
								 />
							 )
						 })
				}
        </VictoryGroup>
      </VictoryChart>

    )
  }
}

export default FTimeSeries;

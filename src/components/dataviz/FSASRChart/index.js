import React, { Component} from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
  VictoryGroup,
  VictoryLabel,
  VictoryTooltip,
  VictoryVoronoiContainer } from 'victory';

import FTooltipSASR from '../../atoms/FTooltipSASR';

import { getDynamicYLabelFormat } from '../../../utils/functions';

const labelStyle = {
  fontFamily: 'IBM Plex Sans',
  fontSize: '7px',
  textAnchor: 'end'
  }

class FSASRChart extends Component {

  static defaultProps = {
      barWidth: 3
   };

  render() {

    const { data } = this.props;
    //sample data structure = [
    //	{ date: "Jan", sanction: 3000, addition: 300, savings: 400, revised: 2900, mark: 20 },
    //	{ date: "Feb", sanction: 3000, addition: 300, savings: 400, revised: 2900, mark: 20 }
    //]

    return (
      <div className="sasr">
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{x: 0}}
        width= {650}
        height= {300}
        padding={{left: 70, right: 70, top: 30, bottom: 70}}
      >
        <VictoryAxis
          label="Date"
          axisLabelComponent={ <VictoryLabel dy={35} style={labelStyle} /> }
          tickLabelComponent={ <VictoryLabel dy={0} style={labelStyle} angle={-45} /> }
          tickFormat={this.props.xLabelFormat}
          tickValues={this.props.xLabelVals}
          />
      <VictoryAxis
        dependentAxis
        label="Amount"
        axisLabelComponent={ <VictoryLabel dy={-45} style={labelStyle} /> }
        tickLabelComponent={ <VictoryLabel dx={5} style={labelStyle} /> }
        tickFormat={(y) => getDynamicYLabelFormat(y)}
      />
        <VictoryGroup
          offset={this.props.barWidth}
          style={{ data: { width: this.props.barWidth} }}
          groupComponent={<g transform={`translate(${this.props.scsrOffset}, 0)`} />}
          labelComponent={<VictoryTooltip
                            labelComponent={<FTooltipSASR/>}
                            flyoutComponent={<g></g>}
                            />}
        >
          <VictoryStack>
            <VictoryBar key={0} style={{ data: { fill:  "#fff", opacity: "0" } }} data={data} x="date" y="sanction"/>
            <VictoryBar key={1} style={{ data: { fill:  "#000" } }} data={data} x="date" y="mark"/>
          </VictoryStack>
          <VictoryStack>
            <VictoryBar key={0} style={{ data: { fill:  "#fff", opacity: "0" } }} data={data} x="date" y="sanction"/>
            <VictoryBar key={1} style={{ data: { fill:  "#000" } }} data={data} x="date" y="mark"/>
            <VictoryBar key={2} style={{ data: { fill:  "#FF6100" } }} data={data} x="date" y="addition" labels={({ datum }) => `${datum.sanction}_${datum.addition}_${datum.savings}_${datum.revised}`} />
          </VictoryStack>
          <VictoryStack >
            <VictoryBar key={0} style={{ data: { fill:  "#fff", opacity: "0" } }} data={data} x="date" y="revised"/>
            <VictoryBar key={1} style={{ data: { fill:  "#000" } }} data={data} x="date" y="mark"/>
            <VictoryBar key={1} style={{ data: { fill:  "#0077FF" } }} data={data}  x="date" y="savings" labels={({ datum }) => `${datum.sanction}_${datum.addition}_${datum.savings}_${datum.revised}`}/>
          </VictoryStack>
          <VictoryStack >
            <VictoryBar key={0} style={{ data: { fill:  "#fff", opacity: "0"} }} data={data} x="date" y="revised"/>
            <VictoryBar key={1} style={{ data: { fill:  "#000" } }} data={data} x="date" y="mark"/>
          </VictoryStack>
        </VictoryGroup>
      </VictoryChart>

      </div>

    )
  }
}



export default FSASRChart;

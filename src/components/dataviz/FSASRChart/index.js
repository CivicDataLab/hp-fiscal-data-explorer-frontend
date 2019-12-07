import React, { Component} from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryStack, VictoryGroup, VictoryLabel } from 'victory';

const tickLabelStyle = {
  fontFamily: 'IBM Plex Sans',
  fontSize: '7px',
  textAnchor: 'end'
  }

class FSASRChart extends Component {

  static defaultProps = {
      //yLabelFormat mnust be an array of 3. each value representing  'prefix', 'suffix' and multiplier
      yLabelFormat: ["","",1],
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
        domainPadding={{x: 30}}
        width= {600}
        height= {300}

      >
        <VictoryAxis
        tickLabelComponent={
          <VictoryLabel
            dy={0}
            style={tickLabelStyle}
            angle={-45}
          />
        }
        tickFormat={this.props.xLabelFormat}
        tickValues={this.props.xLabelPos}
      />
      <VictoryAxis
        dependentAxis
        tickLabelComponent={
          <VictoryLabel
            dx={5}
            style={tickLabelStyle}
          />
        }
        tickFormat={(x) => (this.props.yLabelFormat[0]+(Math.round(x*this.props.yLabelFormat[2]* 100) / 100)+this.props.yLabelFormat[1])}
      />
        <VictoryGroup
          offset={this.props.barWidth}
          style={{ data: { width: this.props.barWidth} }}
          groupComponent={<g transform={`translate(${this.props.scsrOffset}, 0)`} />}
        >
        <VictoryStack >
          <VictoryBar key={0} style={{ data: { fill:  "#fff", opacity: "0" } }} data={data} x="date" y="sanction"/>
          <VictoryBar key={1} style={{ data: { fill:  "#000" } }} data={data} x="date" y="mark"/>
        </VictoryStack>
        <VictoryStack >
          <VictoryBar key={0} style={{ data: { fill:  "#fff", opacity: "0" } }} data={data} x="date" y="sanction"/>
          <VictoryBar key={1} style={{ data: { fill:  "#000" } }} data={data} x="date" y="mark"/>
          <VictoryBar key={2} style={{ data: { fill:  "#FF6100" } }} data={data} x="date" y="addition"/>
        </VictoryStack>
        <VictoryStack >
          <VictoryBar key={0} style={{ data: { fill:  "#fff", opacity: "0" } }} data={data} x="date" y="revised"/>
          <VictoryBar key={1} style={{ data: { fill:  "#000" } }} data={data} x="date" y="mark"/>
          <VictoryBar key={1} style={{ data: { fill:  "#0077FF" } }} data={data}  x="date" y="savings"/>
        </VictoryStack>
        <VictoryStack >
          <VictoryBar key={0} style={{ data: { fill:  "#fff", opacity: "0"} }} data={data} x="date" y="revised"/>
          <VictoryBar key={1} style={{ data: { fill:  "#000" } }} data={data} x="date" y="mark"/>
        </VictoryStack>
        {
          // this.props.dataPoints && //if multiple datapoints is specified via the datapoints prop,
          //   this.props.dataPoints.map((dataToY, i) =>{
          //     return(
          //       <VictoryBar
          //         colorScale={"blue"}
          //         data={this.props.data}
          //         x={this.props.dataToX}
          //         y={dataToY}
          //       />
          //     )
          //   })
        }
        </VictoryGroup>
      </VictoryChart>

      </div>

    )
  }
}

export default FSASRChart;

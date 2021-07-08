import React from 'react';
import ReactDOM from 'react-dom';

import * as d3 from 'd3';

////
///////////////////////////////////////////////////////////
/////// Functions and variables
const width = 800;
const height = 600;
const colorArray = ["#d73027","#fdae61","#abd9e9","#74add1","#1a6cd7"];

const enterNode = (selection) => {
  selection.select('circle')
    .attr("r", d => { return Math.sqrt(d.sanctioncurrent / Math.PI) / 180 })
};

const updateNode = (selection) => {
  selection.select('circle')
              .attr("cx", d => d.x)
              .attr("cy", d => d.y);

  selection.select('g.tooltip')
              .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
};

const updateGraph = (selection) => {
  selection.selectAll('.node')
    .call(updateNode)
};

///////////////////////////////////////////////////////////
/////// Graph component. Holds Node components

class FForce extends React.Component {

  constructor(props){
    super(props);

    this.state ={
      display: 'none',
      translateX: 0,
      translateY: 0
    };
  }

  componentDidMount() {
    this.d3Graph = d3.select(ReactDOM.findDOMNode(this));

    const force = d3.forceSimulation(this.props.data.nodes)
      .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
      .force("center", d3.forceCenter( width/2, height/2))
      .force("collide", d3.forceCollide()
        .strength(.1)
        .radius(d => (Math.sqrt(d.sanctioncurrent / Math.PI) / 180) + 4)
        .iterations(5)) // Force that avoids circle overlapping

    const node = d3.selectAll('g.node')
      .call(d3.drag()
        .on("start", /*dragStarted*/ null)
        .on("drag", /*dragging*/ null)
        .on("end", /*dragEnded*/ null)
      );

    force.on('tick', () => {
      this.d3Graph.call(updateGraph);
    });
  }

  showTooltip(d){
    this.setState(
      {
        display: 'block',
        translateX: d.x,
        translateY: d.y,
        sanctioncurrent: d.sanctioncurrent,
        sanctionprevious: d.sanctionprevious,
        rateOfChange: d.rateOfChange,
        demandDisplayName: d.demandid+"_"+d.demandname
      }
    )
  }

  hideTooltip(){
    this.setState({display: 'none'})
  }

  render() {

    const {display, translateX, translateY, sanctioncurrent, sanctionprevious, rateOfChange, demandDisplayName} = this.state;

    var nodes = this.props.data.nodes.map((node, index) => {
      //set a color code to each node based on rateOfChange to give it the appropriate color
      if(node.rateOfChange < 0){
        node.colorCode = 0;
      }else if(node.rateOfChange > 0 && node.rateOfChange < 0.25){
        node.colorCode = 1;
      }else if(node.rateOfChange > 0.25 && node.rateOfChange < 0.50){
        node.colorCode = 2;
      }else if(node.rateOfChange > 0.50 && node.rateOfChange < 0.75){
        node.colorCode = 3;
      }else if(node.rateOfChange > 0.75){
        node.colorCode = 4;
      }

      return (
        <Node
            index={index}
            data={node}
            key={index}
            display='none'
            showTooltip={this.showTooltip.bind(this)}
            hideTooltip={this.hideTooltip.bind(this)}
            color={colorArray[node.colorCode]}
        />);
    });

    return (
        <svg className="graph"
             width={width}
             height={height}
             viewBox={"0,0,"+width+','+height}
             style={{width: "100%", height: "auto"}}>
          <g>
            {nodes}
          </g>
          <g className="tooltip"
             style={{
               display:display,
               transform: 'translate('+translateX+'px,'+translateY+'px)'
             }}
             stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"
           >
            <g id="Group">
                <rect id="Rectangle" stroke="#979797" fill="#fff" x="0.5" y="0.5" width="239" height="83"></rect>
                <text id="Line-1" fontSize="12" fill="#4A4A4A">
                    <tspan x="10" y="19">{demandDisplayName}</tspan>
                </text>
                <text id="Line-2" fontSize="12" fill="#4A4A4A">
                    <tspan x="10" y="37">Sanction This Year: {sanctioncurrent}</tspan>
                </text>
                <text id="Line-3"  fontSize="12"  fill="#4A4A4A">
                    <tspan x="10" y="55">Sanction Last Year: {sanctionprevious}</tspan>
                </text>
                <text id="Line-4"  fontSize="12" fontWeight="bold" fill="#4A4A4A">
                    <tspan x="10" y="73">% Change: {rateOfChange}</tspan>
                </text>
            </g>
          </g>
        </svg>
    );
  }
}


///////////////////////////////////////////////////////////
/////// Node component

class Node extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      display: this.props.display
    };
  }

  componentDidMount() {
    this.d3Node = d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterNode)
  }

  //the of code had the below componentDidUpdate function, but I can't identify what its doing really, so commented it out.
  // componentDidUpdate() {
  //   this.d3Node.datum(this.props.data)
  //     .call(updateNode)
  // }

  render() {
    return (
      <g className='node'>
          <circle
            fill={this.props.color}
            onMouseEnter={() => this.props.showTooltip(this.props.data)}
            onMouseLeave={this.props.hideTooltip}
          />
      </g>
    );
  }
}

export default FForce;

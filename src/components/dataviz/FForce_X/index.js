import React from 'react';
import ReactDOM from 'react-dom';

import * as d3 from 'd3';


class FForce_X extends React.Component {



  constructor(props){
    super(props);
    this.nodeSize = 85; //increase to increase size of bubbles
    this.axisLabelOptions = {
      alloc:  'label for allocated',
      exp: 'label for expenditure'
    };
    this.axisLabel = '';
  }

  componentDidMount() {
    this.axisLabel = this.axisLabelOptions[this.props.activeDataPoint];
    this.drawChart();
    // console.log("propnodes");
    // console.log(this.props.nodes);
  }

  componentWillUnmount(){
    console.log("remove svg");
    d3.select("#data_viz_wrapper").selectAll("svg").remove();
  }

  componentDidUpdate(){
    // console.log("propnodes");
    // console.log(this.props.nodes);
    d3.select("#data_viz_wrapper").selectAll("svg").remove();
    this.axisLabel = this.axisLabelOptions[this.props.activeDataPoint];
    this.drawChart();

  }

  drawChart(){
    var n = 10,
    	width = 1300,
      height = 400,
    	padding = 10,
    	nodes = [

      ];

    for (var y = 0; y < n; y++) {
    	for (var x = 0; x < n; ++x) {
    		nodes.push({
    			x: 0,
    			y: y,
    		})
    	}
    }
    console.log("this.props.nodes");
    console.log(this.props.nodes);

    var svg = d3.select(".data-viz-wrapper")
    	.append("svg")
    	.attr("width", width)
    	.attr("height", height)
      .attr("viewBox", "0 0 "+width+" "+height)
      .style("width", "100%")
      .style("height", "auto");


    var circlesGroup = svg.append("g")
       .attr("class","circles-group");
      // .attr("transform", "translate(" + width / 2 + "," + width / 2 + ")");

    var scale = d3.scaleLinear()
    	.domain([-40, 70])
    	.range([padding, width - padding ]);

    // Add scales to axis
    var x_axis = d3.axisTop().scale(scale);

    //Append group and insert axis
    svg.append("g")
       .style("transform","translateY(50px)")
       .call(d3.axisTop().scale(scale))


  // text label for the x axis
  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (20) + ")")
      .attr("class","f-axis-label-style")
      .text(this.axisLabel);

    // Define the div for the tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("display", 'none');


    var simulation = d3.forceSimulation()
    	.force("charge", d3.forceManyBody().strength(1))
    	.force("yPos", d3.forceY(height/2).strength(1))
    	.force("xPos", d3.forceX(d => scale(d.pct_change)).strength(1))
    	.force("collide", d3.forceCollide(d => d.radius + 5).strength(1))
      ;

    var circles = circlesGroup.selectAll("foo")
    	.data(this.props.nodes)
    	.enter()
    	.append("circle")
    	.attr("fill", "#000000")
    	// .attr("r", d => {d.radius = d.current/10000000; return d.radius} )
      .attr("r", d => {d.radius = Math.sqrt(d.current / Math.PI) / (100 - this.nodeSize); return d.radius} )
      .on("mouseover", handleTooltipMouseover)
      .on("mouseout", handleTooltipMouseout)
    	// .call(d3.drag()
    	// 	.on("start", dragstarted)
    	// 	.on("drag", dragged)
    	// 	.on("end", dragended));



    function handleTooltipMouseover(d, i) {

      const tooltip_html = (
        `<p class='tt_title'> ${d.demand} ${d.demand_description}</p>
         <div class='tt_body'>
           <p> Current Sanction: ${d.current.toLocaleString('en-IN')} INR </p>
           <p> Percent Change: ${d.pct_change} % </p>
         <div>` )

      //calc if tooltip should show towards right or left depending on pos of bubble
      const h_offset = () => {
        if(d.pct_change < 20){
          return 30;
        }else{
          return -310;
        }
      }

      //populate tooltip with appropriate content
      tooltip.style("display", 'block')
             // .transition()
             // .duration(200)
             // .style("opacity", 1);
      tooltip.html(tooltip_html)
          .style("left", (d3.event.pageX + h_offset()) + "px")
          .style("top", (d3.event.pageY) + "px");

      //stroke the current mouseover-ed circle
      d3.select(this)
        .transition()
        .duration(500)
        .attr("stroke","rgb(255, 97, 0)")
        .attr("stroke-width","3");
    }

    function handleTooltipMouseout(d, i){

      //hide tooltip
      // tooltip.transition()
      //        .duration(500)
      //        .style("opacity", 0)
      //        .style('visibility', 'hidden');

      tooltip.style('display', 'none');

      //de-stroke the current mouseout-ed circle
      d3.select(this)
        .transition()
        .duration(500)
        .attr("stroke-width","0");
    }


    simulation.nodes(this.props.nodes)
    	.on("tick", ticked);

    function ticked() {
    	circles.attr("cx", d => d.x).attr("cy", d => d.y)
    }

    function dragstarted(d) {
    	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    	d.fx = d.x;
    	d.fy = d.y;
    }

    function dragged(d) {
    	d.fx = d3.event.x;
    	d.fy = d3.event.y;
    }

    function dragended(d) {
    	if (!d3.event.active) simulation.alphaTarget(0);
    	d.fx = null;
    	d.fy = null;
    }
  }

  render() {
    return (
      <div className=""></div>
    )
  }
}

export default FForce_X;

import React from "react";
import * as d3 from "d3";

class ContactUs extends React.Component {

  componentDidMount(){
    this.drawChart();
  }

  componentWillUnmount(){
    console.log("remove svg");
    d3.selectAll("svg").remove();
  }



  drawChart(){
    var n = 10,
    	width = 800,
    	padding = 50,
    	nodes = [

      ];

    for (var y = 0; y < n; y++) {
    	for (var x = 0; x < n; ++x) {
    		nodes.push({
    			x: x,
    			y: y,
    		})
    	}
    }

    console.log(nodes);

    var svg = d3.select("body")
    	.append("svg")
    	.attr("width", width)
    	.attr("height", width)
      .append("g");
      // .attr("transform", "translate(" + width / 2 + "," + width / 2 + ")");

    var scale = d3.scaleLinear()
    	.domain([0, 9])
    	.range([padding, width - padding]);

    var simulation = d3.forceSimulation()
    	.force("charge", d3.forceManyBody().strength(-1))
    	.force("xPos", d3.forceX(width/2).strength(1))
    	.force("yPos", d3.forceY(d => scale(d.y)).strength(1))
    	.force("collide", d3.forceCollide(d => d.radius * 1.2).strength(1))
      ;

    var circles = svg.selectAll("foo")
    	.data(nodes)
    	.enter()
    	.append("circle")
    	.attr("fill", "darkslateblue")
    	.attr("r", d => {
    		d.radius = 6  ;
    		return d.radius
    	})
    	.call(d3.drag()
    		.on("start", dragstarted)
    		.on("drag", dragged)
    		.on("end", dragended));

    simulation.nodes(nodes)
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

  render(){
      return <div>Contact Us</div>;
  }

};
export default ContactUs;

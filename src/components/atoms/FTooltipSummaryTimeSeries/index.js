import React from "react";
import sassVars from '../../../scss/_vars.scss'
import tooltipBubble from '../../../imgs/tooltipBubble.svg'
const { orange, blue, lightGrey, darkGrey, extraLightGrey, grey, black, white } = sassVars;

const FTooltipSummaryTimeSeries = ( {
  x, y, datum, datum : { year, amount },
  vizType,
  totalTicks
} ) => {

  // console.log(datum);

  amount = (amount/10000000).toFixed(2).toLocaleString('en-IN');

  let activeDataPoint = '';

  // console.log(datum);
  // console.log(totalTicks);
  const firsthalf = () => {
    if(datum.idx+1 > totalTicks/2){
      return false;
    }else{
      return true;
    }
  }

  const xAxisDimension = year;

  const width = 140;
  const paddingX = 14;

  const generatePolygonPoints = () => {
    switch(vizType){
      case "FTimeSeries" :
      switch(true){
        case firsthalf() === true :
        return "-5 0 140 0 140 60 0 60 0 5";
        default:
        return "0 0 145 0 140 6 140 60 0 60";
      }
      return;
             // "0 0          145 0
             //              140 6
             //
             //
             //              140 96
             //  0 96"
      default:
      return "0 0 140 0 140 42 145 48 140 54 140 96 0 96";
             // "0 0        140 0
             //
             //             140 42
             //               145 48
             //             140 54
             //
             //             140 96
             // 0 96
    }

  }

  if(vizType === "FTimeSeries"){
    if(firsthalf() === true){
      x = x+4;
    }else{
      x = x-width-4;
    }

    // y = (3*y)/2;
  }else{
    x = x-width;
  }

  return (

    <g fontSize={7} transform={`translate(${x},${y})`}>
      <polygon
        points={generatePolygonPoints()}
        fill={black}
        opacity="1"/>

      <g fontWeight={500} transform="translate(0,19)" fill={white} >
        <text x={paddingX} y={0} fill={darkGrey} letterSpacing="0.5" textAnchor="start"> {xAxisDimension} </text>
        <line x1={paddingX} y1={8} x2={width-paddingX} y2={8} stroke={darkGrey} />
        <text fontWeight={activeDataPoint.includes("q") ? 700 : 500} x={paddingX} y={22} letterSpacing="0.5" textAnchor="start"> Amount  : </text>
        <text fontWeight={activeDataPoint.includes("q") ? 700 : 500} x={width-paddingX} y={22} textAnchor="end">Cr {amount}</text>
      </g>
    </g>

  )
}



export default FTooltipSummaryTimeSeries;

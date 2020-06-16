import React from "react";
import sassVars from '../../../scss/_vars.scss'
import tooltipBubble from '../../../imgs/tooltipBubble.svg'
const { orange, blue, lightGrey, darkGrey, extraLightGrey, grey, black, white } = sassVars;

const FTooltipDistrictsAndSchemes = ( {
  x, y, datum, datum : { districtName, idx, gross, AGDED, BTDED, netPayment},
  activeDataPoint,
  vizType,
  totalTicks
} ) => {

  // console.log(datum);

  gross = (gross/100000).toFixed(2).toLocaleString('en-IN');
  netPayment = (netPayment/100000).toFixed(2).toLocaleString('en-IN');
  AGDED = (AGDED/100000).toFixed(2).toLocaleString('en-IN');
  BTDED = (BTDED/100000).toFixed(2).toLocaleString('en-IN');

  if(vizType === "FTimeSeries"){
    activeDataPoint = datum._y === datum.gross ? ["gross"] : ["netPayment"];
  }


  // console.log(datum);
  // console.log(totalTicks);
  const firsthalf = () => {
    if(datum.idx+1 > totalTicks/2){
      return false;
    }else{
      return true;
    }
  }

  const xAxisDimension = (vizType === "FTimeSeries") ?  datum.date :  "";

  const width = 140;
  const paddingX = 14;

  const generatePolygonPoints = () => {
    switch(vizType){
      case "FTimeSeries" :
      switch(true){
        case firsthalf() === true :
        return "-5 0 140 0 140 110 0 110 0 5"; //for timeseries with the pointer to the right
        default:
        return "0 0 145 0 140 6 140 110 0 110"; //for timeseries with the pointer to the left
      }
      return;
             // "0 0          145 0
             //              140 6
             //
             //
             //              140 96
             //  0 96"
      default:
      return "0 0 140 0 140 42 145 48 140 54 140 106 0 106"; //for bar chart i think.
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
        <text x={paddingX} y={0} fill={darkGrey} fontWeight={700} letterSpacing="0.5" textAnchor="start"> {districtName} </text>
        <text x={paddingX} y={14} fill={darkGrey} letterSpacing="0.5" textAnchor="start"> {xAxisDimension} </text>
        <line x1={paddingX} y1={22} x2={width-paddingX} y2={22} stroke={darkGrey} />
        <text fontWeight={activeDataPoint.includes("gross") ? 700 : 500} x={paddingX} y={36} letterSpacing="0.5" textAnchor="start"> Gross  : </text>
        <text fontWeight={activeDataPoint.includes("gross") ? 700 : 500} x={width-paddingX} y={36} textAnchor="end">Lacs {gross}</text>
        <text x={paddingX} y={50} letter-spacing="0.5" text-anchor="start"> AGDED  : </text>
        <text x={width-paddingX} y={50} text-anchor="end"> Lacs {AGDED} </text>
        <text x={paddingX} y={64} letter-spacing="0.5" text-anchor="start">BTDED  : </text>
        <text x={width-paddingX} y={64} text-anchor="end"> Lacs {BTDED} </text>
        <text fontWeight={activeDataPoint.includes("netPayment") ? 700 : 500} x={paddingX} y={78}  letter-spacing="0.5" text-anchor="start"> Net  : </text>
        <text fontWeight={activeDataPoint.includes("netPayment") ? 700 : 500} x={width-paddingX} y={78}  text-anchor="end">Lacs {netPayment} </text>
      </g>
    </g>

  )
}



export default FTooltipDistrictsAndSchemes;

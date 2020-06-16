import React from "react";
import sassVars from '../../../scss/_vars.scss'
const { orange, blue, lightGrey, darkGrey, extraLightGrey, grey, black, white } = sassVars;

const FTooltipReceipts = ( {
  x, y, datum, datum : { date, districtName, receipt },
  vizType,
  totalTicks
} ) => {

  const firsthalf = () => {
    if(datum.idx+1 > totalTicks/2){
      return false;
    }else{
      return true;
    }
  }

  receipt = (receipt/100000).toFixed(2).toLocaleString('en-IN');

  const width = 145;
  const paddingX = 14;
  const yOffset = vizType === 'FTimeSeries' ? 14 : 0;

  const generatePolygonPoints = () => {
    switch(vizType){
      case "FTimeSeries" :
      switch(true){
        case firsthalf() === true :
        return "-5 0 140 0 140 70 0 70 0 5"; //for timeseries with the pointer to the right
        default:
        return "0 0 145 0 140 6 140 70 0 70"; //for timeseries with the pointer to the left
      }
      return;

      default:
      return "0 0 140 0 140 22 145 28 140 34 140 56 0 56"
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
    x = x-width-5;
  }





  return (

    <g fontSize={7} transform={`translate(${x},${y})`}>
      <polygon

        points= { generatePolygonPoints()}
        fill={black}
        opacity="1"
        />

      <g fontWeight={500} transform="translate(0,19)" fill={white} >
      { date && districtName && <text x={paddingX} y={0} fill={darkGrey} fontWeight={700}  letter-spacing="0.5" text-anchor="start"> {districtName} </text> }
        <text x={paddingX} y={0 + yOffset} fill={darkGrey}  letter-spacing="0.5" text-anchor="start"> {date || districtName} </text>
        <line x1={paddingX} y1={8 + yOffset} x2={width-paddingX} y2={8 + yOffset} stroke={darkGrey} />
        <g fontWeight={700}>
          <text x={paddingX} y={24 + yOffset}  letter-spacing="0.5" text-anchor="start"> RECEIPT  : </text>
          <text x={width-paddingX} y={24 + yOffset}  text-anchor="end">Lacs {receipt} </text>
        </g>
      </g>
    </g>
  )
}



export default FTooltipReceipts;

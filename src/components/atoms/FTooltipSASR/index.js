import React from "react";
import sassVars from '../../../scss/_vars.scss'
import tooltipBubble from '../../../imgs/tooltipBubble.svg'
const { orange, blue, lightGrey, darkGrey, extraLightGrey, grey } = sassVars;

const FTooltipSASR = ( { x, y, datum : { date, sanction, revised, addition, savings}} ) => {

  sanction = sanction.toLocaleString('en-IN');
  revised = revised.toLocaleString('en-IN');
  addition = addition.toLocaleString('en-IN');
  savings = savings.toLocaleString('en-IN');


  const width = 140;
  const paddingX = 14;

  x = x-width;


  return (

    <g fontSize={7} transform={`translate(${x},${y})`}>
      <polygon

        points=
          "0 0        140 0

                      140 42
                        145 48
                      140 54

                      140 96
          0 96"
        stroke="#dfdfdf"
        fill="#fff"
        opacity="0.9"/>

      <g fontWeight={500} transform="translate(0,19)" >
        <text x={paddingX} y={0} fill={grey} letter-spacing="0.5" text-anchor="start"> {date} </text>
        <line x1={paddingX} y1={8} x2={width-paddingX} y2={8} stroke={lightGrey} />
        <text x={paddingX} y={22} letter-spacing="0.5" text-anchor="start"> Sanction  : </text>
        <text x={width-paddingX} y={22} text-anchor="end">₹ {sanction}</text>
        <text x={paddingX} y={36} fill={orange} letter-spacing="0.5" text-anchor="start"> Addition  : </text>
        <text x={width-paddingX} y={36} fill={orange} text-anchor="end">+ ₹ {addition} </text>
        <text x={paddingX} y={50} fill={blue} letter-spacing="0.5" text-anchor="start">Savings  : </text>
        <text x={width-paddingX} y={50} fill={blue} text-anchor="end">- ₹ {savings} </text>
        <g fontWeight={700}>
          <text x={paddingX} y={64}  letter-spacing="0.5" text-anchor="start"> Revised  : </text>
          <text x={width-paddingX} y={64}  text-anchor="end">₹ {revised} </text>
        </g>
      </g>
    </g>

  )
}



export default FTooltipSASR;

import React from "react";
import sassVars from '../../../scss/_vars.scss'
const { orange, blue, lightGrey, darkGrey, extraLightGrey, grey, black, white } = sassVars;

const FTooltipReceipts = ( { x, y, datum : { date, districtName, receipt } } ) => {

  receipt = receipt.toLocaleString('en-IN');

  const width = 145;
  const paddingX = 14;

  x = x-width-5;



  return (

    <g fontSize={7} transform={`translate(${x},${y})`}>
      <polygon

        points=
          "0 0        140 0

                      140 22
                        145 28
                      140 34

                      140 56
          0 56"

        fill={black}
        opacity="1"
        />

      <g fontWeight={500} transform="translate(0,19)" fill={white} >
        <text x={paddingX} y={0} fill={darkGrey}  letter-spacing="0.5" text-anchor="start"> {date || districtName} </text>
        <line x1={paddingX} y1={8} x2={width-paddingX} y2={8} stroke={darkGrey} />
        <g fontWeight={700}>
          <text x={paddingX} y={24}  letter-spacing="0.5" text-anchor="start"> RECEIPT  : </text>
          <text x={width-paddingX} y={24}  text-anchor="end">₹ {receipt} </text>
        </g>
      </g>
    </g>
  )
}



export default FTooltipReceipts;

import React from "react"
import { Radio, Tooltip } from 'antd';

import "./_style.scss"

const TooltipText = ['This visualization relies on data for the previous financial year. As 2014-15 data is unavailable, the visualization cannot be generated', 'YoY comparison for ongoing FY will be updated after March 31, 2021. For 2020-21 expenditure data at district, treasury & DDO level, click her']

const financialYears = [{label: "2016-17", disabled: true}, {label: "2017-18", disabled: false}, {label: "2018-19", disabled: false}, {label: "2019-20", disabled: false}, {label: "2020-21", disabled: false}, ]

const FRadioTabs = (props) => {

  return(
    <Radio.Group defaultValue={"2019-20"} buttonStyle="solid" className={props.className} onChange={props.onChange}>
      {
        financialYears.map((year, i) => {
          if(i===0 || i===4){
            return (
              <Tooltip title={i === 0 ? TooltipText[0] : TooltipText[1]} >
                <Radio.Button value={year.label} disabled={year.disabled}>{year.label}</Radio.Button>
              </Tooltip>
            )
          }
          else{
            return (
              <Radio.Button value={year.label} disabled={year.disabled}>{year.label}</Radio.Button>
            )
          }
        })
      }
    </Radio.Group>
  )
}

export default FRadioTabs;
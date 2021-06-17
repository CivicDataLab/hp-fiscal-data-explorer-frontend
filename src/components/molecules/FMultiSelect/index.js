import React from "react";

import { Select, Tooltip, Tag } from 'antd';

import "./_style.scss"


const FMultiSelect = ({className, disabled, initialSelectedItems, useTitleInItem, label, invalid, invalidText, onChange, items, type}) => {

  const handleChange = (val, arr) => {
    let event = {selectedItems: arr}
    if(type==="timeseries"){
      if(val.length > 1 && val[val.length - 1] === 'All Demands'){
        val = ['All Demands']
        onChange(val)
      }
      else{
        val = val.filter(item => item !== 'All Demands')
        onChange(val)
      }
    }
    else{
      onChange(event)
    }
  } 

  function tagRender(props) {
    const { label, value, closable, onClose } = props;
  
    return (
      <Tooltip title={label}>
      <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
        {label.length > 20 ? label.substring(0, 15) + '...' : label}
      </Tag>
      </Tooltip>
    );
  }
  return (
    <div className={className} key={items && items.length && items[0].filter_name}>
    <Select
      mode="multiple"
      disabled={disabled}
      tagRender={tagRender}
      value={initialSelectedItems ? initialSelectedItems.map(item => item.label) : []}
      style={{ width: '100%' }}
      placeholder="ALL"
      options={items}
      onChange={handleChange}
  />
    </div>
  )};


export default FMultiSelect;

import React from "react";
import { Link } from "react-router-dom";
import RadioButtonGroup from 'carbon-components-react/lib/components/RadioButtonGroup';
import RadioButton from 'carbon-components-react/lib/components/RadioButton';
import FormGroup from 'carbon-components-react/lib/components/FormGroup';

const FRadioGroup = props => {

  console.log('valueSelected: '+ props.valueSelected);

  return (
    <div className={props.className}>
        <RadioButtonGroup
          defaultSelected={props.valueSelected}
          labelPosition="right"
          legend="Group Legend"
          name={props.items && props.items[0].filter_name || props.name}
          onChange={props.onChange}
          orientation="horizontal"
          valueSelected={props.valueSelected}
        >
        { props.items &&
          props.items.map((rbutton, i) =>(
            <RadioButton
              key={i}
              id= {`${rbutton.filter_name}_${rbutton.id}`}
              labelText= {rbutton.label}
              value= {rbutton.id}
              disabled={props.disableExpButton && i === 1}
            />
            )
          )
        }
        </RadioButtonGroup>
    </div>
  )};

FRadioGroup.defaultProps = {
  //yLabelFormat mnust be an array of 3. each value representing  'prefix', 'suffix' and multiplier
  className: "f-radio-group",
  name: "radio-button-group",
  titleText: "radio button heading",
  radioButtons: [
    {id:"radio-1", labelText: "radio1", value: "default-selected"},
    {id:"radio-2", labelText: "radio2", value: "standard"}
  ]
};

export default FRadioGroup;

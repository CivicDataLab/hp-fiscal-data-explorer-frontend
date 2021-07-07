import React, {Component} from "react";
import { Link } from "react-router-dom";
import Dropdown from "carbon-components-react/lib/components/Dropdown";
import TooltipDefinition from "carbon-components-react/lib/components/TooltipDefinition";

class FDropdown extends Component{

  render(){
    return (
      <div className={this.props.className}>
        <Dropdown
          ariaLabel="Dropdown"
          disabled={false}
          id="f-dropdown"
          invalidText="A valid value is required"
          itemToElement={null}
          items={this.props.items}
          initialSelectedItem={this.props.initialSelectedItem}
          selectedItem={this.props.selectedItem}
          label={this.props.label}
          light={false}
          onChange={this.props.onChange}
          titleText={this.props.titleText}
          type="default"
        />
      </div>
    )
  }
}



FDropdown.defaultProps = {
  //yLabelFormat mnust be an array of 3. each value representing  'prefix', 'suffix' and multiplier
  className: "f-dropdown",
  titleText: "Dropdown Title",
  label: "Dropdown Label",
  items: [
    {
      dd_name: "name of dd", //should be the same as the key name in the raw fiscal data
      id: "loading...",
      label: "Loading..."
    }
  ]
};

export default FDropdown;

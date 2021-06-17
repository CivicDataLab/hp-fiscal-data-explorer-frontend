import React from "react";
import MediaQuery from "react-responsive";

//custom components
import FDropdown from '../../../components/molecules/FDropdown';


const FFilterColumn = ({ onChange, receiptsFilterCompData, filterOrderRef, allFiltersData, activeFilters  }) => {

  //declare the components that need to be dynamically generated
	const Components = { FDropdown };

  return (

    <div className="filter-col">
      {
        receiptsFilterCompData.map((filter_comp,i) => {
            const Component = Components[filter_comp.comp]
            return (
              <Component
                className = "filter-col--ops"
                titleText = {filter_comp.titleText}
                label = "All"
                onChange = {onChange}
                items = {allFiltersData[i] && allFiltersData[i].val}
                selectedItem = { activeFilters && activeFilters.filters[filterOrderRef[i]] ? activeFilters.filters[filterOrderRef[i]] : "All" }
                />
            )
          }
        )
      }

    </div>

  );
}
export default FFilterColumn;

import React, {useState, Fragment} from "react";
import MediaQuery from "react-responsive";

//custom components
import { MultiSelect } from 'carbon-components-react';

import FilterIcon from '@carbon/icons-react/lib/filter/32'
import CloseIcon from '@carbon/icons-react/lib/close/32'
import FilterIconFilled from '../../icons/FilterIconFilled';

//carbon icons

const FFilterColumn2 = ({ onChange, allFiltersData, filterCompData, filtersLoading, activeFilters, onFilterIconClick  }) => {

  //declare the components that need to be dynamically generated
	const Components = { MultiSelect };

	const [RenderedFilterIcon, setRenderedFilterIcon ] = useState("FilterIcon"  );

  const handleMouseEnter = () => {
		if(RenderedFilterIcon !== "CloseIcon") setRenderedFilterIcon( "FilterIconFilled")
	}

  const handleMouseLeave = () => {
		if(RenderedFilterIcon !== "CloseIcon") setRenderedFilterIcon("FilterIcon")
	}

	const handleOnClick = () => {
		setRenderedFilterIcon(RenderedFilterIcon === "CloseIcon" ? "FilterIcon" : "CloseIcon");
		onFilterIconClick();
	}

  return (

		<div className="filter-col-wrapper-2">
			<div
				className="f-filter-icon-wrapper"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={handleOnClick}
				>
			{	RenderedFilterIcon === "CloseIcon" ? <CloseIcon /> :
				RenderedFilterIcon === "FilterIcon" ? <FilterIcon /> : <FilterIconFilled /> }
			</div>
	    <div className="filter-col">


	      {
	        filterCompData.map((filter_comp,i) => {
	            const Component = Components[filter_comp.comp]
	            return (
								<div className = "filter-col--ops">
		              <Component
		                className={`f-${allFiltersData[i] && allFiltersData[i].key}-multiselect`}
		                titleText = {filter_comp.titleText}
										disabled = {filtersLoading}
										useTitleInItem={false}
										label={filtersLoading ? "Loading..." : activeFilters[allFiltersData[i].key] ? activeFilters[allFiltersData[i].key].join(", ") : "All"}
										invalid={false}
										invalidText="Invalid Selection"
										onChange = {(e) => onChange(e, allFiltersData[i] && allFiltersData[i].key)}
		                items = {allFiltersData[i] && allFiltersData[i].val}
		                />
								</div>

	            )
	          }
	        )
	      }

	    </div>
		</div>

  );
}
export default FFilterColumn2;

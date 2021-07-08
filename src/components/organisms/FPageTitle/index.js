import React, {useState} from "react";
import MediaQuery from "react-responsive";

//custom components
import FLegend from '../../../components/molecules/FLegend';



const FPageTitle = ({ pageTitle, pageDescription, monthPicker, showLegend }) => {



  return (

      <div className="f-page-title">
				<div className="f-page-title__left-aligned-content">

					<div>
            <h3>{pageTitle}</h3>
            <p className="f-page-title__description">
							{pageDescription}
						</p>
          </div>
          { monthPicker }

				</div>
        {
          showLegend && ( <FLegend /> )
        }

			</div>

  );
}
export default FPageTitle;

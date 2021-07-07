import React, {useState} from "react";
import MediaQuery from "react-responsive";

import ChevronDown from '@carbon/icons-react/lib/chevron--down/16';
import ChevronUp from '@carbon/icons-react/lib/chevron--up/16';

const FPageTitle = ({ pageTitle, pageDescription, monthPicker, showLegend }) => {

  const [showPageDesc, setShowPageDesc] = useState(false);

  const toggleSetShowDesc = () => setShowPageDesc(!showPageDesc);

  return (

      <div className='f-page-title-wrapper'>
        <div className="f-page-title">
  				<div className="f-page-title__left-aligned-content">
            <h3>{pageTitle}</h3>
          { monthPicker }
  				</div>
  			</div>
        <div className='f-page-description-wrapper' style={{padding: showPageDesc === false ? '0' : '1rem 2rem'}}>
        { showPageDesc &&
          pageDescription.map(d => ( <p className="f-page-description">{d}</p> )) }
        </div>
        <div style={{display: 'flex', alignItems: 'center', padding: '0 2rem'}}>

          <div onClick={toggleSetShowDesc} style={{cursor: 'pointer'}}>
          { showPageDesc === false
          ? <div style={{display: 'flex'}}><h6 className='more-info-text'>more info </h6><ChevronDown className='more-info-chevron'/></div>
          : <div style={{display: 'flex'}}><h6 className='more-info-text'>less info </h6><ChevronUp className='more-info-chevron'/> </div> }
          </div>
        </div>
      </div>
  );
}
export default FPageTitle;

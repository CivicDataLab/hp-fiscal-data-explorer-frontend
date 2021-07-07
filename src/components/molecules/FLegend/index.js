import React, {Component, Fragment, useState} from "react";
import { Link } from "react-router-dom";
//carbon icons
import HelpIcon from '@carbon/icons-react/lib/help/32'
import HelpFilledIcon from '@carbon/icons-react/lib/help--filled/32'
import CloseIcon from '@carbon/icons-react/lib/close/20'

const FLegend = ({className}) => {

    const [RenderedHelpIcon, setRenderedHelpIcon ] = useState(HelpIcon  );
    const [showLegendContent, setShowLegendContent] = useState(false);

    const handleMouseEnter = () => { setRenderedHelpIcon(HelpFilledIcon) }
    const handleMouseLeave = () => { setRenderedHelpIcon(HelpIcon) }

    const handleShowLegendContent = () => { setShowLegendContent(!showLegendContent) }

    return (

      <div className={`f-legend ${className}`}>
        <div
          className="f-legend-icon"
          onClick={handleShowLegendContent}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          >
          <RenderedHelpIcon />
        </div>
        {
          showLegendContent && (
            <div className="f-legend-content">
              <div className="f-legend-content__title">
                <h6>ANATOMY OF THIS GRAPH</h6>
                <div
                  className="f-legend-close-icon"
                  onClick={handleShowLegendContent}
                  >
                  <CloseIcon />
                </div>
              </div>
              <hr/>
              <div className="f-legend-content__body">
                the diagram svg will come here.
              </div>
            </div>
          )

        }
      </div>

    )
  }






export default FLegend;

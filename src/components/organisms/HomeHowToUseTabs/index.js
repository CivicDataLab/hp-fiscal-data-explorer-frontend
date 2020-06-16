import React, {useState, Fragment} from "react";
import {Tabs, Tab } from 'carbon-components-react';
import {Link} from "react-router-dom";

import howToUseContent from '../../../data/howToUseContent.json';
import placeholder from '../../../imgs/placeholder.jpg';

const HomeHowToUseTabs = (props) => {

const handleTabClick = e => console.log(e.target.value);

const imgs = {
  placeholder
}

  return (

      <Fragment>
        <Tabs

          className="f-home__how-to-use-tabs"
          iconDescription="show menu options"
          onKeyDown={function noRefCheck(){}}
          onSelectionChange={function noRefCheck(){}}
          role="navigation"
          selected={0}
          tabContentClassName="f-tab-content"
          triggerHref="#"
          type="container"
        >
        {
          howToUseContent.map((d, i) => {
            let img = imgs[d.content.img];
            return (
              <Tab
                id={d.id}
                label={d.label}
                role="presentation"
                tabIndex={i}
              >
                <div className="f-tab-content-wrapper">
                  <div className='bx--row' style={{ alignItems: 'center'}}>
                    <div className='f-tab-content__text-wrapper bx--col-lg-6'>
                      <h4 className='f-tab-content__title'>{d.content.title}</h4>
                      { d.content.body.map(datum => (
                        <p className='f-tab-content__body'>{datum}</p>
                      )) }
                      <Link className='f-link f-tab-content__link' to={d.content.link.route}>{d.content.link.text}</Link>
                    </div>
                    <div className='f-tab-content__img_wrapper bx--col-lg-6'>
                      <img className='f-tab-content__img' src={img}/>
                    </div>
                  </div>
                </div>
              </Tab>
            )})
        }

        </Tabs>
			</Fragment>

  );
}
export default HomeHowToUseTabs;

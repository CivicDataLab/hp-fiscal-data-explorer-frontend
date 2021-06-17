import React, {Fragment, useState} from "react";

import {Search} from 'carbon-components-react';
import glossary from '../../data/glossary.json';
import FPageMeta from '../../components/organisms/FPageMeta';

const Glossary = () => {

  const glossaryKeys = Object.keys(glossary);
  let glossaryData = {};
  glossaryKeys.map(d => {
    glossaryData[d] = Object.values(glossary[d].data);
  })

  const [ data, setData ] = useState(glossaryData);
  console.log(data);

  const handleSearch = e => {

    const glossaryKeys = Object.keys(glossary);
    let results = {};
    glossaryKeys.map(d => {
      results[d] = [];
    })

    Object.values(glossaryData).map((d,i) => {
      d.map((datum,j) =>{
        let dKey = Object.keys(glossaryData)[i];

        if (datum.title.toLowerCase().indexOf(e.target.value) >= 0){
          results[dKey].push(glossaryData[dKey][j])
        }
      })
    })
    // console.log(results);
    setData(results);
  }

  return(
    <div className="f-content glossary bx--grid">
      <FPageMeta pageId = 'glossary' />
      <div className='bx--offset-lg-3 bx--col-lg-6 glossary-contents-wrapper'>
        <h1 style={{ fontWeight: '500'}}>Glossary</h1>
          <div className='glossary-search-bar-wrapper'>
            <Search
              className="glossary-search-bar"
              closeButtonLabelText="Clear search input"
              defaultValue=""
              id="glossary-search-bar"
              labelText="Search For A Term"
              name=""
              onChange={e => handleSearch(e)}
              placeHolderText="Search"
              size="xl"
              type="text"
            />
          </div>
          {
            Object.values(data).map((d,i) => (
              <div className='glossary_section'>
                <h6  className='glossary__section-title'>{glossary[Object.keys(glossary)[i]].title}</h6>
                <ul className='glossary__section-contents'>
                { d.map(datum => (
                    <li className='glossary__item'>
                      <p className='glossary__item_title'>{datum.title}</p>
                      <p className='glossary__item_desc'>{datum.desc}</p>
                    </li>
                  )) }
                </ul>
              </div>
            ))
          }

      </div>
    </div>
  )

}

export default Glossary;

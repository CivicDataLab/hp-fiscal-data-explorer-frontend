import React, {useState, useEffect, useRef, Fragment} from "react";
import {Tabs, Tab } from 'carbon-components-react';
import {Link} from "react-router-dom";

import ChevronLeft from '@carbon/icons-react/lib/chevron--left/32';
import ChevronRight from '@carbon/icons-react/lib/chevron--right/32';


import didYouKnowContent from '../../../data/didYouKnowContent.json';
import all from '../../../imgs/didyouknow_imgs/all.svg';
import hamirpur_bilaspur from '../../../imgs/didyouknow_imgs/hamirpur_bilaspur.svg';
import hamirpur_mandi_shimla from '../../../imgs/didyouknow_imgs/hamirpur_mandi_shimla.svg';
import kangra from '../../../imgs/didyouknow_imgs/kangra.svg';
import mandi_sirmaur from '../../../imgs/didyouknow_imgs/mandi_sirmaur.svg';
import shimla from '../../../imgs/didyouknow_imgs/shimla.svg';

import {white, grey} from '../../../scss/_vars.scss'

const DidYouKnow = (props) => {

  const handleTabClick = e => console.log(e.target.value);

  const imgs = {
    all,
    hamirpur_bilaspur,
    hamirpur_mandi_shimla,
    kangra,
    mandi_sirmaur,
    shimla
  }

  const [activeIdx, setActiveIdx] = useState(0);

  const [imgColHeight, setImgColHeight] = useState(null)

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const switchSlide = (direction) => {
    if(direction === 'left' && activeIdx !== 0){
      setActiveIdx(activeIdx-1);
    }else if (direction === 'right' && activeIdx !== didYouKnowContent.length-1){
      setActiveIdx(activeIdx+1);
    }
  }

  const autoUpdateIdx = () => {
    console.log('ran again');
    setInterval(() => updateActiveIdx(), 8000);
  }

  const updateActiveIdx = () => {
      function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    console.log(getRandomInt(didYouKnowContent.length));
    setActiveIdx(getRandomInt(didYouKnowContent.length));
  }

  useEffect(() => {
    autoUpdateIdx();
  },[])

  const renderText = () => {
    return(
      <div className='f-did-you-know-content-wrapper f-did-you-know-content-wrapper--text bx--col-lg-6'>
      { didYouKnowContent.map((d,i) => (
        <div
          className='did-you-know-slide did-you-know-slide--text'
          style={{transform: `translateX(${-1*activeIdx*100}%)`}}
          >
        { d.content.map(datum => <p className='f-did-you-know__body' >{datum}</p>)}
        { d.link && <Link className='f-link f-did-you-know__link' to={d.link.route}>{d.link.text}</Link>}
        </div> )) }
      </div>
    )
  }

  const renderImg = () => {
    return(
      <div className='f-did-you-know-content-wrapper f-did-you-know-content-wrapper--img bx--col-lg-6'>
      { didYouKnowContent.map((d,i) => (
            <div
              className='did-you-know-slide did-you-know-slide--img'
              style={{opacity: i === activeIdx ? 1 : 0, transform: `translateX(${-1*i*100}%)` }}
              >
              <img  src={imgs[d.img]} />
            </div>
          )) }
      </div>
    )
  }

  return (
    <div className='f-did-you-know-wrapper'>
      <h1 className='did-you-know-section-title'>Did You Know!</h1>
      <div className='bx--row'>
        <ChevronLeft
          className={`did-you-know__chevron-left ${activeIdx === 0 ? 'disabled' : ''}`}
          onClick={() => switchSlide('left')}
          style={{zIndex: '10000'}}
          />
        <ChevronRight
          className={`did-you-know__chevron-right ${activeIdx === didYouKnowContent.length-1 ? 'disabled' : ''}`}
          onClick={() => switchSlide('right')}
          style={{zIndex: '10000'}}
          />
        { screenWidth <= 1055
          ? <Fragment>{renderImg()} {renderText()}</Fragment>
          : <Fragment>{renderText()} {renderImg()}</Fragment> }
      </div>
		</div>
  );
}
export default DidYouKnow;

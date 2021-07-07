import React, { Fragment } from "react";
import {Link} from "react-router-dom";
import FHPMapImg from '../../components/atoms/FHPMapImg';
import HomeHowToUse from '../../components/organisms/HomeHowToUse';
import DidYouKnowIcon from '../../components/icons/DidYouKnowIcon';
import didYouKnowContent from '../../data/didYouKnowContent.json';
import DidYouKnow from '../../components/organisms/DidYouKnow';
import CoverImg from '../../imgs/cover_img.svg';
import FPageMeta from '../../components/organisms/FPageMeta';

const Home = (props) =>  {

  return (
    <div className='f-content f-home'>
      <FPageMeta pageId = 'home' />
      <div className='f-home__section f-home__cover'>
        <img className='f-home__cover-bg-img' src={CoverImg} alt="_blank"/>
        <div className='bx--row'>
          <div className='f-home__cover-text-wrapper bx--offset-lg-6 bx--col-lg-6'>
            <h1 className='f-cover-title'>Himachal Fiscal Data Explorer</h1>
            <h4 className='f-cover-subtitle'>Fiscal Data Explorer is a unique tool where citizens can explore both budgets and spending data of state governments in an easy to comprehend and simple to use manner.</h4>
          </div>
          {/*<div className='bx--col-lg-6 f-home__cover-img-wrapper'><FHPMapImg style={{width:'100%'}} /></div>*/}
        </div>
      </div>
      <div className='f-home__section f-home__how-to-use'>
        {/*<h1 className='f-home__section-title'>How to use this Data Explorer?</h1>*/}
        <HomeHowToUse />
      </div>
      {/*<div className='f-home__section f-home__did-you-know'>
        <h1 className='f-home__section-title'>Did you know?</h1>
        <div className='bx--row'>
        { didYouKnowContent.map((d,i) => (
          <div className='f-did-you-know-content-wrapper bx--col-lg-3'>
            <div><DidYouKnowIcon/></div>
            { d.content.map(datum => <p className='f-did-you-know__body' style={{fontStyle : 'italic'}}>{datum}</p>)}
            { d.link && <Link className='f-link f-did-you-know__link' to={d.link.route}>{d.link.text}</Link>}
          </div>
        )) }
        </div>
      </div>*/}

    </div>
  )
}


export default Home;

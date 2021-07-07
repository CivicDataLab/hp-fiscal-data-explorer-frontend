import React, {useState} from "react";
import { Helmet } from 'react-helmet';
//data
import seoMeta from '../../../data/seoMeta.json';

import HomeImg from '../../../imgs/metaImg.jpg';
import ReceiptsImg from '../../../imgs/metaImg.jpg';
import ReceiptsDistrictwiseImg from '../../../imgs/metaImg.jpg';
import ExpSummaryImg from '../../../imgs/metaImg.jpg';
import ExpDetailsImg from '../../../imgs/metaImg.jpg';
import ExpDistrictwiseImg from '../../../imgs/metaImg.jpg';
import ExpSchemesImg from '../../../imgs/metaImg.jpg';
import GlossaryImg from '../../../imgs/metaImg.jpg';
import AboutUsImg from '../../../imgs/metaImg.jpg';

const FPageMeta = ({ pageId }) => {

  const metaImg = {
    HomeImg,
    ReceiptsImg,
    ReceiptsDistrictwiseImg,
    ExpSummaryImg,
    ExpDetailsImg,
    ExpDistrictwiseImg,
    ExpSchemesImg,
    GlossaryImg,
    AboutUsImg
  }

  return (

    <Helmet>
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoMeta[pageId].title} />
      <meta property="og:description" content={seoMeta[pageId].description} />
      <meta property="og:image" content={window.location.origin + metaImg[seoMeta[pageId].img]} />
      <meta property="og:url" content={window.location.href} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={seoMeta[pageId].title} />
      <meta name="twitter:description" content={seoMeta[pageId].description} />
      <meta name="twitter:image" content={window.location.origin + metaImg[seoMeta[pageId].img]} />
      <meta name="twitter:url" content={window.location.href} />
    </Helmet>
    
  );
}

export default FPageMeta;

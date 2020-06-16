import React, {Fragment, useState} from "react";

import FPageMeta from '../../components/organisms/FPageMeta';

import aboutus from '../../data/aboutus.json';

import arun_img from '../../imgs/aboutus_imgs/arun_img.jpg';
import gaurav_img from '../../imgs/aboutus_imgs/gaurav_img.jpg';
import abrar_img from '../../imgs/aboutus_imgs/abrar_img.jpg';
import namita_img from '../../imgs/aboutus_imgs/namita_img.jpg';
import preethi_img from '../../imgs/aboutus_imgs/preethi_img.jpg';
import sheneille_img from '../../imgs/aboutus_imgs/sheneille_img.jpg';
import shreya_img from '../../imgs/aboutus_imgs/shreya_img.jpg';
import simonti_img from '../../imgs/aboutus_imgs/simonti_img.jpg';
import swati_img from '../../imgs/aboutus_imgs/swati_img.jpg';
import arpit_img from '../../imgs/aboutus_imgs/arpit_img.jpg';
import shivam_img from '../../imgs/aboutus_imgs/shivam_img.jpg';

const AboutUs = () => {

  const imgs = {
    arun_img,
    gaurav_img,
    abrar_img,
    namita_img,
    preethi_img,
    sheneille_img,
    shreya_img,
    simonti_img,
    swati_img,
    arpit_img,
    shivam_img
  }

  return(
    <div className="f-content aboutus bx--grid">
      <FPageMeta pageId = 'about_us' />
      <div className='bx--offset-lg-1 bx--col-lg-10 about-us-content-wrapper'>
        <h1 style={{ fontWeight: '500'}}>About Us</h1>
        <div className='bx--row about-us-content' >
          { aboutus.map( (d, i) => (
            <div key={i} className='bx--col-lg-4 f-person-card'>
              <div className='f-person-card__img-wrapper' style={{width:'100%'}}>
                <img src={imgs[d.img]} alt="" />
              </div>
              <div className='f-person-card__text-wrapper'>
              <h3 className='f-person-card__name'>{d.name}</h3>
              <p className='f-person-card__desc'>{d.desc}</p>
              </div>
            </div>
          )) }

        </div>
      </div>
    </div>
  )

}

export default AboutUs;

import React, {useState} from "react";
import errorScreen1 from '../../../imgs/error_screen_1.svg'

const FNoDataFound = () => {


  return (
    <div className='f-no-data-found-container'>
      <img src={errorScreen1} alt="" className='f-no-data-found-container__img'/>
      <div className='f-no-data-found-container__text-group'>
      <h2 className='f-no-data-found-container__text'>We could not find any data in response to your filter selection :(</h2>
      <h4 className='f-no-data-found-container__text'>Please change your current filter selection to try again!</h4>
      </div>
    </div>
  );
}
export default FNoDataFound;

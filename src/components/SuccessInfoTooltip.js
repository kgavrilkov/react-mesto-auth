import React from 'react';
import InfoTooltip from './InfoTooltip';
import successPicPath from '../images/successPic.svg';

function SuccessInfoTooltip({isOpen, onClose}) {
  return (
    <InfoTooltip isOpen={isOpen} onClose={onClose}>
      <img className="popup__image-tooltip" src={successPicPath} alt="#" />
      <p className="popup__caption-tooltip">Вы успешно зарегистрировались!</p>
    </InfoTooltip>
  );
}

export default SuccessInfoTooltip;
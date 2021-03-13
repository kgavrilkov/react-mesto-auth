import React from 'react';
import InfoTooltip from './InfoTooltip';
import failPicPath from '../images/failPic.svg';

function FailInfoTooltip({isOpen, onClose}) {
  return (
    <InfoTooltip isOpen={isOpen} onClose={onClose}>
      <img className="popup__image-tooltip" src={failPicPath} alt="#" />
      <p className="popup__caption-tooltip">Что-то пошло не так! Попробуйте ещё раз.</p>
    </InfoTooltip>
  );
}

export default FailInfoTooltip;
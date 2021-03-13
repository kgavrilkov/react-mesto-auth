import React from 'react';

function InfoTooltip({isOpen, children, onClose}) {
  return (
    <div className={`popup popup_type_tooltip ${isOpen && 'popup_opened'}`}>
      <div className="popup__container popup__container_type_tooltip">
        <div className="popup__form popup__form_type_tooltip">
          {children}
        </div>
        <button type="button" className="button popup__close popup__close_type_tooltip" aria-label="close" 
        onClick={onClose}></button> 
      </div>
    </div>
  );
}

export default InfoTooltip;
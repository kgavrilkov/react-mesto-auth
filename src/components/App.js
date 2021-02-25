import React from 'react';
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import DeleteCardPopup from './DeleteCardPopup';
import api from '../utils/api';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen]=React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen]=React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen]=React.useState(false);
  const [selectedCard, setSelectedCard]=React.useState();
  const [currentUser, setCurrentUser]=React.useState({name: '', about: ''});
  const [cards, setCards]=React.useState([]);

  React.useEffect(() => {
    api.getUserInfo()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch(err => console.log(`Ошибка в информации о пользователе: ${err}`));
  }, []);

  React.useEffect(() => {
    api.getInitialCards()
      .then((cardData) => {
        setCards(cardData);
      })
      .catch(err => console.log(`Ошибка при загрузке карточек: ${err}`));
  }, []);

  function handleCardLike(card) {
    const isLiked=card.likes.some(item => item._id===currentUser._id);

    api.changeLikeStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards=cards.map((c) => c._id===card._id ? newCard : c);
        setCards(newCards);
      })
      .catch(err => console.log(`Ошибка в статусе лайка: ${err}`)); 
  }

  function handleCardDelete(card) {
    api.removeCard(card._id)
      .then(() => {
        setCards(cards.filter((c) => c._id!==card._id));
      })
      .catch(err => console.log(`Ошибка при удалении карточки: ${err}`));
  }
   
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(info) {
    api.setUserInfo(info)
      .then((data) => {
        setCurrentUser(data);
      })
      .catch(err => console.log(`Ошибка обновления информации о пользователе: ${err}`));
  }

  function handleUpdateAvatar(info) {
    api.setUserAvatar(info)
      .then((data) => {
        setCurrentUser(data); 
      })
      .catch(err => console.log(`Ошибка обновления аватара: ${err}`));
  }

  function handleAddPlaceSubmit(info) {
    api.addCard(info)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .catch(err => console.log(`Ошибка добавления карточки: ${err}`));
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard();
  }

  return (
    <div className="root">
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header />
          <Main
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardDelete={handleCardDelete}
            onCardLike={handleCardLike}
            cards={cards}
          />
          <Footer />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar} 
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser} 
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />
          <ImagePopup
            card={selectedCard} 
            onClose={closeAllPopups}
          />
          <DeleteCardPopup
            onClose={closeAllPopups}
          />
        </CurrentUserContext.Provider>
      </div>  
    </div>
  );
}

export default App;

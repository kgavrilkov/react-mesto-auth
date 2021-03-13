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
import {Route, Switch, Redirect, useHistory} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import SuccessInfoTooltip from './SuccessInfoTooltip';
import FailInfoTooltip from './FailInfoTooltip';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';     

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen]=React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen]=React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen]=React.useState(false);
  const [selectedCard, setSelectedCard]=React.useState();
  const [currentUser, setCurrentUser]=React.useState({name: '', about: ''});
  const [cards, setCards]=React.useState([]);
  const [isSuccessInfoTooltipOpen, setIsSuccessInfoTooltipOpen]=React.useState(false);
  const [isFailInfoTooltipOpen, setIsFailInfoTooltipOpen]=React.useState(false);
  const [loggedIn, setLoggedIn]=React.useState(false);
  const initialData={email: '', password: ''};
  const [data, setData]=React.useState(initialData);
  const history=useHistory();
  
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

  function handleSuccessInfoTooltipClick() {
    setIsSuccessInfoTooltipOpen(true);
  }

  function handleFailInfoTooltipClick() {
    setIsFailInfoTooltipOpen(true);
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

  const handleRegister = ({email, password}) => {
    return auth.register(email, password).then(res => {
      if (!res || res.statusCode === 400) throw new Error('Некорректно заполнено одно из полей');
      handleSuccessInfoTooltipClick();
      return res;
    });
  }

  const handleLogin = ({email, password}) => {
    return auth.authorize(email, password).then(res => {
      if (!res || res.statusCode === 401) throw new Error('Пользователь с email не найден');
      if (res.token) {
        setLoggedIn(true);
        localStorage.setItem('token', res.token);
      };
      return res;
    });
  }

  const tokenCheck = React.useCallback(() => {
    const token=localStorage.getItem('token');
    if (token) {
      auth.getContent(token)
        .then((res) => {
          if (!res || res.statusCode === 401) throw new Error('Токен не передан или переданный токен некорректен');
          if (res) {
            setLoggedIn(true);
            setData({
              email: res.data.email
            });
            history.push('/main');
          }
        })
        .catch(() => history.push('/signin'));
    }
  }, [history])

  React.useEffect(() => {
    tokenCheck();
  }, [tokenCheck, loggedIn]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setData(initialData);
    setLoggedIn(false);
    history.push('/signin');
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard();
    setIsSuccessInfoTooltipOpen(false);
    setIsFailInfoTooltipOpen(false);
  }

  return (
    <div className="root">
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header 
            loggedIn={loggedIn} 
            userEmail={data.email} 
            onSignOut={handleSignOut} 
          />
          <Switch>
            <ProtectedRoute path="/main" 
              component={Main}
              loggedIn={loggedIn} 
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              onCardDelete={handleCardDelete}
              onCardLike={handleCardLike}
              cards={cards}
            />
            <Route path="/signin">
              <Login
                onFailInfoTooltip={handleFailInfoTooltipClick}
                onLogin={handleLogin}
              />
            </Route>
            <Route path="/signup">
              <Register
                onFailInfoTooltip={handleFailInfoTooltipClick}
                onRegister={handleRegister} 
              />
            </Route>
            <Route>
              {loggedIn ? <Redirect to="/main" /> : <Redirect to="/signin" />}
            </Route>
          </Switch>
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
          <SuccessInfoTooltip
            isOpen={isSuccessInfoTooltipOpen}
            onClose={closeAllPopups} 
          />
          <FailInfoTooltip
            isOpen={isFailInfoTooltipOpen}
            onClose={closeAllPopups} 
          />
        </CurrentUserContext.Provider>
      </div>  
    </div>
  );
}

export default App;

import React from 'react';
import {Link, useHistory} from 'react-router-dom';

function Register({onFailInfoTooltip, onRegister}) {
  const initialData={email: '', password: ''};
  const [data, setData]=React.useState(initialData);
  const history=useHistory();

  const handleChange = (evt) => {
    const {name, value}=evt.target;
    setData(data => ({
      ...data,
      [name]: value,
    }));
  }

  const resetForm = () => {
    setData(initialData);
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!data.email || !data.password) {
      onFailInfoTooltip();
      return;
    }

    onRegister(data)
      .then(resetForm)
      .then(() => history.push('/signin'))
      .catch(err => {
        console.log(`Некорректно заполнено одно из полей: ${err}`); 
        onFailInfoTooltip();
      })
  }    

  return (
    <div className="register">
      <form className="register__form" onSubmit={handleSubmit} noValidate>
        <h2 className="register__heading">Регистрация</h2>
        <input className="register__input" type="email" name="email" 
        value={data.email} onChange={handleChange} required placeholder="Email" />
        <input className="register__input" type="password" name="password" 
        value={data.password} onChange={handleChange} required placeholder="Пароль" 
        minLength="8" maxLength="12" />
        <button type="submit" className="button register__button" >Зарегистрироваться</button>
        <p className="register__info">Уже зарегистрированы?
          <Link className="register__link" to="/signin"> Войти</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
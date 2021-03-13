import React from 'react';
import {Switch, Route} from 'react-router-dom';

function Footer() {
  return (
    <Switch>
      <Route path="/main">
        <footer className="footer page__footer">
          <p className="footer__paragraph">&copy; 2021 Mesto Russia</p>
        </footer>
      </Route>
      <Route path="/signin">
        <footer className="footer page__footer" style={{display: 'none'}}>
          <p className="footer__paragraph">&copy; 2021 Mesto Russia</p>
        </footer>
      </Route>
      <Route path="/signup">
        <footer className="footer page__footer" style={{display: 'none'}}>
          <p className="footer__paragraph">&copy; 2021 Mesto Russia</p>
        </footer>
      </Route>
    </Switch>
  );
}

export default Footer;
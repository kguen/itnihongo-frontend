import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserContext from './contexts/UserContext';
import AlertContext from './contexts/AlertContext';
import tokenConfig from './utils/tokenConfig';
import './App.scss';

const App = () => {
  const [user, setUser] = useState({
    token: localStorage.getItem('token'),
    data: null,
  });
  const [alert, setAlert] = useState({
    hasAlert: false,
    message: null,
    error: false,
  });

  const providerUserValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const providerAlertValue = useMemo(() => ({ alert, setAlert }), [
    alert,
    setAlert,
  ]);

  useEffect(() => {
    if (user.token) {
      axios
        .get('http://localhost:3030/api/v1/auth/me', tokenConfig(user))
        .then(res => {
          setUser({
            ...user,
            data: res.data.data,
          });
        })
        .catch(err => {
          localStorage.removeItem('token');
          setUser({
            ...user,
            token: null,
            user: null,
          });
        });
    }
  }, [user.token]);

  useEffect(() => {
    if (alert.hasAlert) {
      setTimeout(() => {
        setAlert({ hasAlert: false });
      }, 2000);
    }
  }, [alert]);

  return (
    <UserContext.Provider value={providerUserValue}>
      <AlertContext.Provider value={providerAlertValue}>
        <div className="container my-container d-flex flex-column">
          <Alert
            show={alert.hasAlert}
            className="my-alert align-self-center"
            variant={alert.error ? 'danger' : 'success'}
            onClick={() => setAlert({ hasAlert: false })}
          >
            {alert.message}
          </Alert>
          <Router>
            <Header />
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/signup">
                <SignUp />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
            </Switch>
          </Router>
        </div>
      </AlertContext.Provider>
    </UserContext.Provider>
  );
};

export default App;

import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import AlertContext from '../../contexts/AlertContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);

  return (
    <Route
      {...rest}
      render={props => {
        if (user.token) {
          return <Component {...props} />;
        }
        setAlert({
          hasAlert: true,
          message: 'You must login before continue',
          error: true,
        });
        return <Redirect to="/login" />;
      }}
    />
  );
};

export default PrivateRoute;

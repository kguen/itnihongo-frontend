import React, { useContext } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import UserContext from '../../contexts/UserContext';
import AlertContext from '../../contexts/AlertContext';

const schema = yup.object({
  email: yup.string().email('Not an email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);

  return user.token ? (
    <Redirect to="/" />
  ) : (
    <Formik
      validationSchema={schema}
      validateOnChange={false}
      onSubmit={values => {
        const data = {
          email: values.email,
          password: values.password,
        };
        axios
          .post('http://localhost:3030/api/v1/auth/login', data)
          .then(res => {
            localStorage.setItem('token', res.data.token);
            setUser({
              ...user,
              token: res.data.token,
            });
            setAlert({
              hasAlert: true,
              message: 'Login success!',
            });
            history.push('/');
          })
          .catch(err => {
            localStorage.removeItem('token');
            setUser({
              ...user,
              data: null,
              token: null,
              liked: [],
              avatar: null,
            });
            setAlert({
              hasAlert: true,
              message: 'Incorrect email/password',
              error: true,
            });
          });
      }}
      initialValues={{
        email: '',
        password: '',
      }}
    >
      {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
        <div className="vh-100 d-flex flex-column align-items-center justify-content-center container">
          <Link className="mb-3" to="/">
            <img
              width="60"
              height="60"
              src="https://getbootstrap.com/docs/4.5/assets/brand/bootstrap-solid.svg"
              alt="bootstrap logo"
            />
          </Link>
          <h2>Sign In</h2>
          <span className="lead mb-4">Sign in to your personal account</span>
          <div className="w-50 d-flex flex-column align-items-center">
            <div className="w-75">
              <Form noValidate className="mb-2" onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter a password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button className="w-100" variant="primary" type="submit">
                  Sign in
                </Button>
              </Form>
              <div className="text-right">
                <small className="text-muted">
                  Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default Login;

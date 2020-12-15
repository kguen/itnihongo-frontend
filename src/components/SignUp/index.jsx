import React, { useContext } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import AlertContext from '../../contexts/AlertContext';
import './styles.scss';

const schema = yup.object({
  fullName: yup
    .string()
    .required('Name is required')
    .min(5, 'Name must be at least 5 characters long')
    .max(255, 'Name is too long'),
  email: yup
    .string()
    .email('Not an email')
    .required('Email is required')
    .min(5, 'Email must be at least 5 characters long')
    .max(255, 'Email is too long'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Minimum password length is 6 characters')
    .max(255, 'Password is too long'),
  confirmPassword: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password'), null], "Password confirmation didn't match"),
});

const SignUp = () => {
  const history = useHistory();
  const { setAlert } = useContext(AlertContext);

  return (
    <Formik
      validationSchema={schema}
      onSubmit={values => {
        const data = {
          user_name: values.fullName,
          email: values.email,
          password: values.password,
          password_confirmation: values.confirmPassword,
        };
        axios
          .post('http://localhost:3030/api/v1/signup', data)
          .then(() => {
            setAlert({
              hasAlert: true,
              message: 'Account created! You can now login',
            });
            history.push('/login');
          })
          .catch(err => {
            setAlert({
              hasAlert: true,
              message: `${err.response.data.errors[0]}.`,
              error: true,
            });
          });
      }}
      initialValues={{
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        errors,
      }) => (
        <div className="vh-100 d-flex flex-column align-items-center justify-content-center container">
          <Link className="mb-3" to="/">
            <img
              width="60"
              height="60"
              src="https://getbootstrap.com/docs/4.5/assets/brand/bootstrap-solid.svg"
              alt="bootstrap logo"
            />
          </Link>
          <h2>Create account</h2>
          <span className="lead mb-4">
            Create an account to write your own blog
          </span>
          <div className="w-50 d-flex flex-column align-items-center">
            <div className="w-75">
              <Form noValidate className="mb-2" onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                  <Form.Label className="required-label">Full name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.fullName && !errors.fullName}
                    placeholder="Enter your name"
                    isInvalid={!!errors.fullName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label className="required-label">
                    Email address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.email && !errors.email}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label className="required-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter a password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.password && !errors.password}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label className="required-label">
                    Confirm password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Retype a password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.confirmPassword && !errors.confirmPassword}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button className="w-100" variant="primary" type="submit">
                  Create your account
                </Button>
              </Form>
              <div className="text-right">
                <small className="text-muted">
                  Already have an account? <Link to="/login">Sign in</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default SignUp;

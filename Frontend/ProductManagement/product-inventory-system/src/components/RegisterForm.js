import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form as BootstrapForm } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa'; 

const RegisterForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await axios.post('/register/', values);
      navigate('/login');  
    } catch (error) {
      setErrors({ username: 'Username or email already exists' });
    } finally {
      setSubmitting(false);
    }
  };  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: '30rem', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Card.Header className="bg-primary text-white text-center" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <h4 className="my-2">
            <FaUserPlus className="me-2" /> {/* Adding the icon */}
            Register
          </h4>
        </Card.Header>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <BootstrapForm.Group className="mb-3" controlId="formUsername">
                  <BootstrapForm.Label>Username</BootstrapForm.Label>
                  <Field
                    type="text"
                    name="username"
                    className="form-control"
                  />
                  <ErrorMessage name="username" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mb-3" controlId="formEmail">
                  <BootstrapForm.Label>Email</BootstrapForm.Label>
                  <Field
                    type="email"
                    name="email"
                    className="form-control"
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mb-3" controlId="formPassword">
                  <BootstrapForm.Label>Password</BootstrapForm.Label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <BootstrapForm.Group className="mb-3" controlId="formConfirmPassword">
                  <BootstrapForm.Label>Confirm Password</BootstrapForm.Label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                  Register
                </Button>
              </Form>
            )}
          </Formik>
          <div className="mt-3 text-center">
            <p>
              Already registered? &nbsp; <a href='/login'>Login here</a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterForm;

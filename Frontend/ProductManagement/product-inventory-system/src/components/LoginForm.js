import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form as BootstrapForm } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa'; 


const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('/login/', values);
      const token = response.data.token;
      login(token);
      navigate('/product-form');  
    } catch (error) {
      setErrors({ username: 'Invalid credentials', password: 'Invalid credentials' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: '25rem', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Card.Header className="bg-primary text-white text-center" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <h4 className="my-2">
            <FaSignInAlt className="me-2" /> {/* Adding the icon */}
            Login
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

                <BootstrapForm.Group className="mb-3" controlId="formPassword">
                  <BootstrapForm.Label>Password</BootstrapForm.Label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                  Login
                </Button>
              </Form>
            )}
          </Formik>
          <div className="mt-3 text-center">
            <p>
              Not yet registered? &nbsp; <a href='/register'>Register here</a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginForm;

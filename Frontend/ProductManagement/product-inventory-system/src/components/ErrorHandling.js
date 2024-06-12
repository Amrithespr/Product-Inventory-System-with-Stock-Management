

import React from 'react';

const ErrorHandling = ({ error }) => {
  if (!error) return null;
  return <div style={{ color: 'red' }}>{error}</div>;
};

export default ErrorHandling;

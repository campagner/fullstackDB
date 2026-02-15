import React from 'react';
import App from './App';

describe('App component', () => {
  test('renders without crashing', () => {
    const { render } = require('@testing-library/react');
    render(<App />);
  });
});

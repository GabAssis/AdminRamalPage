// components/Layout.js
import React from 'react';
import Menu from './Menu';

const Layout = ({ children }) => {
  return (
    <div>
      <Menu />
      <div style={{ marginLeft: '300px', padding: '20px' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;

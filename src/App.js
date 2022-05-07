import 'antd/dist/antd.css';
import AppLayout from 'layout/AppLayout';
import React from 'react';
import AppRoutes from 'routes/AppRoutes';
import './App.scss';

function App() {
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
}

export default App;

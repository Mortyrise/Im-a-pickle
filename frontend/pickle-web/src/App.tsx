import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthForm from './auth/AuthForm';
import Characters from './characters/Characters';
import ProtectedRoute from './utils/ProtectedRoute';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App" style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f8f8f8 0%, #e6f7fa 100%)' }}>
        <Routes>
          <Route path="/login" element={<AuthForm />} />
          <Route path="/characters" element={
            <ProtectedRoute>
              <Characters />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

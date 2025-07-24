import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './auth/AuthForm';
import Characters from './characters/Characters';
import CharacterDetail from './characters/CharacterDetail';
import ProtectedRoute from './utils/ProtectedRoute';
import { FavoritesProvider } from './characters/FavoritesContext';
import { AuthProvider } from './auth/AuthContext';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<AuthForm />} />
              <Route path="/characters" element={
                <ProtectedRoute>
                  <Characters />
                </ProtectedRoute>
              } />
              <Route path="/characters/:id" element={
                <ProtectedRoute>
                  <CharacterDetail />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

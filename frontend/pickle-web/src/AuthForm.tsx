import React, { useState } from 'react';
import './AuthForm.css';
import { login as loginService, register as registerService } from './authService';

type Mode = 'login' | 'register';

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (mode === 'register' && password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        const data = await loginService(email, password);
        localStorage.setItem('token', data.access_token);
        setSuccess('Login successful!');
      } else {
        await registerService(username, email, password);
        setSuccess('Registration successful! You can now log in.');
        setMode('login');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirm('');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-container" onSubmit={handleSubmit}>
      <div className="auth-title">{mode === 'login' ? 'Sign in' : 'Create account'}</div>
      {mode === 'register' && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="auth-input"
          autoComplete="username"
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="auth-input"
        autoComplete="email"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="auth-input"
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
      />
      {mode === 'register' && (
        <input
          type="password"
          placeholder="Repeat password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          className="auth-input"
          autoComplete="new-password"
        />
      )}
      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? (mode === 'login' ? 'Signing in...' : 'Registering...') : (mode === 'login' ? 'Sign in' : 'Register')}
      </button>
      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}
      <button
        type="button"
        className="auth-link"
        onClick={() => {
          setMode(mode === 'login' ? 'register' : 'login');
          setError('');
          setSuccess('');
        }}
      >
        {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign in'}
      </button>
    </form>
  );
};

export default AuthForm;

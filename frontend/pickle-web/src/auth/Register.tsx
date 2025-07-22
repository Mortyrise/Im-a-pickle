import React, { useState } from 'react';
import './Login.css';
import { apiCaller } from './apiCaller';

const Register: React.FC = () => {
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
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await apiCaller('/auth/register', {
        method: 'POST',
        body: { email, password },
      });
      setSuccess('Registration successful! You can now log in.');
      setEmail('');
      setPassword('');
      setConfirm('');
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="portal">
    <h2 className="rick-font">Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="input-style"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="input-style"
      />
      <input
        type="password"
        placeholder="Repeat password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        required
        className="input-style"
      />
      <button type="submit" disabled={loading} className="button-style">{loading ? 'Registering...' : 'Register'}</button>
      {error && <div className="error-msg">{error}</div>}
      {success && <div style={{ color: '#00b5cc', fontWeight: 'bold' }}>{success}</div>}
    </form>
  );
};

export default Register;

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="admin-form-card">
        <h2>Foundation Clearance Login</h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
          Enter your authorized credentials to access secure archives.
        </p>

        {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

        <form onSubmit={handleLogin} className="crud-form">
          <div className="form-group">
            <label>Agent Email</label>
            <input
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@scp.foundation"
            />
          </div>

          <div className="form-group">
            <label>Security Password</label>
            <input
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Authorize Access'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
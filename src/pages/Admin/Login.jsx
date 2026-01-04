import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { login } from '../../redux/authSlice';
import { Lock } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.auth);

    if (isAuthenticated) {
        return <Navigate to="/admin/dashboard" />;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ username, password }));
        // Check if login was successful (state update is distinct action, but effectively immediate here)
        // Ideally we check state after dispatch, but for simple mock:
        if (username === 'admin' && password === 'admin123') {
            navigate('/admin/dashboard');
        } else {
            alert('Identifiants incorrects (admin / admin123)');
        }
    };

    return (
        <div className="container animate-fade-in" style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', marginBottom: '1rem' }}>
                        <Lock size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem' }}>Espace Administrateur</h1>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Utilisateur</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--background)', backgroundColor: 'var(--background)', color: 'var(--text)' }}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--background)', backgroundColor: 'var(--background)', color: 'var(--text)' }}
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Se connecter</button>
            </form>
        </div>
    );
};

export default Login;

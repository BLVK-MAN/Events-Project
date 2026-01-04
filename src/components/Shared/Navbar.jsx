import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, LogOut, ShieldCheck } from 'lucide-react';
import { logout } from '../../redux/authSlice';

const Navbar = () => {
    const { totalQuantity } = useSelector((state) => state.cart);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav style={{
            backgroundColor: 'var(--surface)',
            padding: '1rem 0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>◎</span> EventSphere
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/" style={{ fontWeight: '500' }}>Accueil</Link>
                    <Link to="/events" style={{ fontWeight: '500' }}>Événements</Link>
                    <Link to="/contact" style={{ fontWeight: '500' }}>Contact</Link>

                    {isAuthenticated && user?.role === 'admin' && (
                        <Link to="/admin/dashboard" style={{ fontWeight: '500', color: 'var(--secondary)' }}>Dashboard</Link>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <ShoppingCart size={24} color="var(--text)" />
                            {totalQuantity > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    backgroundColor: 'var(--secondary)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <button onClick={handleLogout} style={{ background: 'none', color: 'var(--text-muted)' }} title="Déconnexion">
                                <LogOut size={24} />
                            </button>
                        ) : (
                            <Link to="/admin/login" style={{ color: 'var(--text-muted)' }} title="Admin Login">
                                <ShieldCheck size={24} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React from 'react';
import Navbar from '../Shared/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '2rem 0' }}>
                <Outlet />
            </main>
            <footer style={{ backgroundColor: 'var(--surface)', padding: '2rem 0', marginTop: 'auto' }}>
                <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>&copy; {new Date().getFullYear()} EventSphere Studio. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;

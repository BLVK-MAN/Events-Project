import { createSlice } from '@reduxjs/toolkit';

// Check localStorage for existing session
const storedAuth = localStorage.getItem('auth');
const initialState = storedAuth ? JSON.parse(storedAuth) : {
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            if (action.payload.username === 'admin' && action.payload.password === 'admin123') {
                state.isAuthenticated = true;
                state.user = { role: 'admin', username: 'admin' };
                // Persist to localStorage
                localStorage.setItem('auth', JSON.stringify(state));
            }
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            // Clear localStorage
            localStorage.removeItem('auth');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

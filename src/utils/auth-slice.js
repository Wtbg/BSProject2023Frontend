import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
    },
    reducers: {
        setCredentials(state, action) {
            const {user, token} = action.payload;
            state.user = user;
            state.token = token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        },
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;
export const user = state => state.auth.user;
export const token = state => state.auth.token;
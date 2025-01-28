// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Thunk para guardar la sesión
export const setSessionAuth = createAsyncThunk(
    'auth/saveToken',
    async (store, thunkAPI) => {
        try {
            const { token, lang } = store;
            await AsyncStorage.setItem('authToken', token);
            return { token, lang };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk para remover la sesión
export const removeSessionAuth = createAsyncThunk(
    'auth/removeToken',
    async (_, thunkAPI) => {
        try {
            await AsyncStorage.removeItem('authToken');
            return true;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Slice de autenticación
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        token: null,
        lang: null,
        loading: false,
        error: null
    },

    extraReducers: (builder) => {
        builder
            // Casos para setSessionAuth
            .addCase(setSessionAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setSessionAuth.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.token = action.payload.token;
                state.loading = false;
                state.error = null;
            })
            .addCase(setSessionAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Casos para removeSessionAuth
            .addCase(removeSessionAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeSessionAuth.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.token = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(removeSessionAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;

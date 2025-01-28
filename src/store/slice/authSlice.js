import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helpers para AsyncStorage
const getStoredToken = async () => {
    try {
        return await AsyncStorage.getItem('token') || null;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

const getStoredPermissions = async () => {
    try {
        const permissions = await AsyncStorage.getItem('permissions');
        return permissions ? JSON.parse(permissions) : [];
    } catch (error) {
        console.error('Error getting permissions:', error);
        return [];
    }
};

const getStoredRoles = async () => {
    try {
        const roles = await AsyncStorage.getItem('roles');
        return roles ? JSON.parse(roles) : [];
    } catch (error) {
        console.error('Error getting roles:', error);
        return [];
    }
};

const initialState = {
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    user: null,
    permissions: [],
    roles: []
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        removeSessionAuth: (state) => {
            state.id = null;
            state.token = null;
            state.permissions = [];
            state.roles = [];
            state.isAuthenticated = false;

            // Limpiar AsyncStorage
            (async () => {
                try {
                    await AsyncStorage.multiRemove(['token', 'permissions', 'roles']);
                } catch (error) {
                    console.error('Error removing credentials:', error);
                }
            })();
        },
        setCredentials: (state, action) => {
            const { token, permissions, roles } = action.payload;
            state.token = token;
            state.permissions = permissions;
            state.roles = roles;
            state.isAuthenticated = true;

            // Guardar en AsyncStorage
            (async () => {
                try {
                    await AsyncStorage.setItem('token', token);
                    await AsyncStorage.setItem('permissions', JSON.stringify(permissions));
                    await AsyncStorage.setItem('roles', JSON.stringify(roles));
                } catch (error) {
                    console.error('Error saving credentials:', error);
                }
            })();
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.permissions = [];
            state.roles = [];

            // Limpiar AsyncStorage
            (async () => {
                try {
                    await AsyncStorage.multiRemove(['token', 'permissions', 'roles']);
                } catch (error) {
                    console.error('Error removing credentials:', error);
                }
            })();
        },
        initializeAuth: (state, action) => {
            const { token, permissions, roles } = action.payload;
            state.token = token;
            state.permissions = permissions;
            state.roles = roles;
            state.isAuthenticated = !!token;
        }
    }
});

// Selectores
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserPermissions = (state) => state.auth.permissions;
export const selectUserRoles = (state) => state.auth.roles;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Helper functions
export const hasPermission = (state, permission) => {
    return state.auth.permissions.includes(permission);
};

export const hasRole = (state, role) => {
    return state.auth.roles.includes(role);
};

// Thunk para inicializar el estado de autenticación
export const initializeAuthState = () => async (dispatch) => {
    try {
        const [token, permissions, roles] = await Promise.all([
            getStoredToken(),
            getStoredPermissions(),
            getStoredRoles()
        ]);

        dispatch(initializeAuth({ token, permissions, roles }));
    } catch (error) {
        console.error('Error initializing auth state:', error);
    }
};

export const {
    setCredentials,
    setLoading,
    setError,
    logout,
    initializeAuth,
    removeSessionAuth,
} = authSlice.actions;

export default authSlice.reducer;

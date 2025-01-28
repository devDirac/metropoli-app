// features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveSessionUser = async (user) => {
    try {
        await AsyncStorage.setItem('sessionUser', JSON.stringify(user));
    } catch (error) {
        console.log('Error saving user to storage:', error);
    }
};

const loadSessionUser = createAsyncThunk('user/fetchUserFromStorage', async () => {
    try {
        console.log('Loading User');

        const user = await AsyncStorage.getItem('sessionUser');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.log('Error fetching user from storage:', error);
        return null;
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        name: null,
        email: null,
        company: null,
        image_profile: null,
        admin: 0,
    },
    reducers: {
        setSessionUser: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.company = action.payload.company;
            state.image_profile = action.payload.image_profile;
            state.admin = action.payload.admin;

            saveSessionUser(action.payload);
        },
        removeSessionUser: (state) => {
            state.id = null;
            state.name = null;
            state.email = null;
            state.company = null;
            state.image_profile = null;
            state.admin = null;
            saveSessionUser(null);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadSessionUser.fulfilled, (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        });
    },
});

export const { setSessionUser, removeSessionUser } = userSlice.actions;
export { loadSessionUser };
export const getSessionUser = ({user}) => user;

export default userSlice.reducer;

import * as React from 'react';
import { useState, useEffect } from 'react';
import {  TouchableOpacity, StyleSheet } from 'react-native';
import {  Avatar } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getSessionUser, loadSessionUser, removeSessionUser } from '@/store/slice/userSlice';
import { removeSessionAuth } from '@/store/slice/authSlice';

// Views imports

import Delete from '@views/user/Delete';
import Logout from '@views/user/Logout';
import Setting from '@views/user/Setting';
import Notifications from '@views/user/Notifications';
import Config from '@views/user/Config';

import Login from '@views/auth/Login';
import Signup from '@views/auth/Signup';
import SignupSuccess from '@views/auth/SignupSuccess';
import VerificationCode from '@views/auth/VerificationCode';
import Reset from '@views/auth/Reset';
import NewPassword from '@views/auth/NewPassword';
import ResetSuccess from '@views/auth/ResetSuccess';
import ResetL from '@views/auth/ResetL';
import ResetPhone from '@views/auth/ResetPhone';
import ResetEmail from '@views/auth/ResetEmail';

import Splash from '@views/start/Splash';
import Info from '@views/Info';
import SSuccess from '@views/SSuccess';
import LSuccess from '@views/LSuccess';
import Terms from '@views/Terms';

const RNDrawer = createDrawerNavigator();

const DrawerNavigation = () => {
    const [showSplashScreen, setShowSplashScreen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector(getSessionUser);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const darkModeValue = await AsyncStorage.getItem('darkMode');
                if (darkModeValue !== null) {
                    setDarkMode(JSON.parse(darkModeValue));
                }

                const firstLaunchValue = await AsyncStorage.getItem('isFirstLaunch');
                if (firstLaunchValue === null) {
                    await AsyncStorage.setItem('isFirstLaunch', 'false');
                    setIsFirstLaunch(true);
                } else {
                    setIsFirstLaunch(false);
                }
            } catch (error) {
                console.error('Error initializing app:', error);
            }
        };

        initializeApp();

        const splashTimer = setTimeout(() => {
            setShowSplashScreen(false);
        }, 2000);

        return () => clearTimeout(splashTimer);
    }, []);

    useEffect(() => {
        dispatch(loadSessionUser());

        if (user?.name) {
            const initials = user.name
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
            setAvatarName(initials);
        }
    }, [dispatch, user.name]);

    const selectItemMenu = (screen) => {
        setActive(screen);
        navigation.navigate(screen);
    };

    const handleLogout = () => {
        dispatch(removeSessionUser());
        dispatch(removeSessionAuth());
        navigation.reset({
            index: 0,
            routes: [{ name: 'Logout' }],
        });
    };

    const headerRight = () => (
        <TouchableOpacity onPress={() => selectItemMenu('Perfil')}>
            {!user.name ? (
                <Avatar.Image
                    source={require('@assets/image/s25.png')}
                    size={30}
                    style={styles.avatarImage}
                />
            ) : (
                <Avatar.Text
                    label={user.name.charAt(0)}
                    size={30}
                    style={styles.avatarImage}
                />
            )}
        </TouchableOpacity>
    );

    return (
        <themeContext.Provider value={darkMode ? theme.dark : theme.light}>
            <RNDrawer.Navigator
                screenOptions={{
                    headerTitleAlign: 'center',
                    headerRight,
                }}
            >
                {showSplashScreen && (
                    <RNDrawer.Screen
                        name="Splash"
                        component={Splash}
                        options={{ headerShown: false }}
                    />
                )}


                {user.email === null && (
                    <RNDrawer.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                )}



                <RNDrawer.Screen name="Principal" component={Home} />
                <RNDrawer.Screen name="Perfil" component={Account} />
                <RNDrawer.Screen name="Terms" component={Terms} options={{ headerShown: false }} />
                <RNDrawer.Screen
                    name="SignupSuccess"
                    component={SignupSuccess}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="Delete"
                    component={Delete}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="Logout"
                    component={Logout}
                    options={{ headerShown: false }}
                />

                <RNDrawer.Screen
                    name="Profile"
                    component={Profile}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="Info"
                    component={Info}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="Setting"
                    component={Setting}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="Reset"
                    component={Reset}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="Notifications"
                    component={Notifications}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="Config"
                    component={Config}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="NewPassword"
                    component={NewPassword}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="ResetSuccess"
                    component={ResetSuccess}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="ResetL"
                    component={ResetL}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="ResetEmail"
                    component={ResetEmail}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="ResetPhone"
                    component={ResetPhone}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="SSuccess"
                    component={SSuccess}
                    options={{ headerShown: false }}
                />
                <RNDrawer.Screen
                    name="Signup"
                    component={Signup}
                    options={{ headerShown: false }}
                />

                <RNDrawer.Screen
                    name="LSuccess"
                    component={LSuccess}
                    options={{ headerShown: false }}
                />

            </RNDrawer.Navigator>
        </themeContext.Provider>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    drawerContent: {
        flex: 1,
        paddingTop: 20,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingBottom: 20,
    },
    avatarImage: {
        marginRight: 16,
    },
});

export default DrawerNavigation;

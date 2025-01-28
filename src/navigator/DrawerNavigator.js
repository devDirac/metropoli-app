import * as React from 'react';
import {useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import {Avatar} from 'react-native-paper';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {getSessionUser, loadSessionUser, removeSessionUser} from '@/store/slice/userSlice';
import {selectAuth, removeSessionAuth} from '@/store/slice/authSlice';

import Delete from '@views/user/Delete';
import Logout from '@views/user/Logout';
import Setting from '@views/user/Setting';
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
import SignupType from '@views/auth/SignupType';
import CreateReport from '@views/reports/Create';
import AccountScreen from '@views/user/Account';
import ReportsScreen from '@views/reports/Reports';

import {$theme} from "@/config/theme";
import NotificationScreen from "@views/user/Notifications";
import NotificationView from "@views/user/NotificationView";

const RNDrawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function AdminNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
                headerShown: false
            }}
        >
            <Tab.Screen
                name="Reports"
                component={ReportsScreen}
                options={{
                    tabBarLabel: ({color}) => (
                        <Text style={[styles.tabLabel, {color}]}>Reportes</Text>
                    ),
                    tabBarIcon: ({color}) => (
                        <Icon name="document-text" size={24} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="CreateReport"
                component={CreateReport}
                options={{
                    tabBarLabel: ({color}) => (
                        <Text style={[styles.tabLabel,{paddingTop:2}]}>Reportar</Text>
                    ),
                    tabBarIcon: () => (
                        <View style={styles.createReportButton}>
                            <Icon name="camera" size={30} color="#000" />
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Account"
                component={AccountScreen}
                options={{
                    tabBarLabel: ({color}) => (
                        <Text style={[styles.tabLabel]}>Cuenta</Text>
                    ),
                    tabBarIcon: ({color}) => (
                        <Icon name="person" size={24}  color="#fff" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

function UserNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
                headerShown: false
            }}
        >
            <Tab.Screen
                name="Reports"
                component={ReportsScreen}
                options={{
                    tabBarLabel: ({color}) => (
                        <Text style={[styles.tabLabel, {color}]}>Reportes</Text>
                    ),
                    tabBarIcon: ({color}) => (
                        <Icon name="document-text" size={24} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="CreateReport"
                component={CreateReport}
                options={{
                    tabBarLabel: ({color}) => (
                        <Text style={[styles.tabLabel,{paddingTop:2}]}>Reportar</Text>
                    ),
                    tabBarIcon: () => (
                        <View style={styles.createReportButton}>
                            <Icon name="camera" size={30} color="#000" />
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Account"
                component={AccountScreen}
                options={{
                    tabBarLabel: ({color}) => (
                        <Text style={[styles.tabLabel]}>Cuenta</Text>
                    ),
                    tabBarIcon: ({color}) => (
                        <Icon name="person" size={24}  color="#fff" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// Navegador para Responsable
function ResponsibleNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
                headerShown: false
            }}
        >
            <Tab.Screen
                name="Reports"
                component={ReportListScreen}
                options={{
                    tabBarLabel: ({color}) => (
                        <Text style={[styles.tabLabel, {color}]}>Mi Equipo</Text>
                    ),
                    tabBarIcon: ({color}) => (
                        <Icon name="people-outline" size={24} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="CreateReport"
                component={CreateReport}
                options={{
                    tabBarLabel: ({color}) => (
                        <Text style={[styles.tabLabel, {color}]}>Crear</Text>
                    ),
                    tabBarIcon: () => (
                        <View style={styles.createReportButton}>
                            <Icon name="add" size={32} color="#fff" />
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="ReportManage"
                component={ReportListScreen}
                options={{
                    tabBarLabel: ({color}) => (
                        <Text style={[styles.tabLabel, {color}]}>Gestión</Text>
                    ),
                    tabBarIcon: ({color}) => (
                        <Icon name="briefcase-outline" size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const DrawerNavigation = () => {
    const [showSplashScreen, setShowSplashScreen] = useState(true);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector(getSessionUser);
    const auth = useSelector(selectAuth);

    useEffect(() => {
        const splashTimer = setTimeout(() => {
            setShowSplashScreen(false);
        }, 2000);

        return () => clearTimeout(splashTimer);
    }, []);

    useEffect(() => {
        dispatch(loadSessionUser());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(removeSessionUser());
        dispatch(removeSessionAuth());
        navigation.reset({
            index: 0,
            routes: [{name: 'Logout'}],
        });
    };





    const headerRight = () => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            {!user.name ? (
                <Avatar.Image
                    source={require('@assets/images/placeholders/avatar.png')}
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

    const getNavigatorByRole = () => {
        switch (user.role[0]) {
            case 'admin':
                return AdminNavigator;
            case 'responsible':
                return ResponsibleNavigator;
            default:
                return UserNavigator;
        }
    };

    if (showSplashScreen) {
        return <Splash/>;
    }

    return (
        <RNDrawer.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerRight: user.email ? headerRight : null,
            }}
        >
            {!user.email || !auth.token ? (
                <>
                    <RNDrawer.Screen
                        name="Login"
                        component={Login}
                        options={{headerShown: false}}
                    />
                    <RNDrawer.Screen
                        name="Signup"
                        component={Signup}
                        options={{headerShown: false}}
                    />
                    <RNDrawer.Screen
                        name="SignupType"
                        component={SignupType}
                        options={{headerShown: false}}
                    />
                    <RNDrawer.Screen
                        name="Reset"
                        component={Reset}
                        options={{headerShown: false}}
                    />
                    <RNDrawer.Screen
                        name="ResetL"
                        component={ResetL}
                        options={{headerShown: false}}
                    />
                    <RNDrawer.Screen
                        name="ResetEmail"
                        component={ResetEmail}
                        options={{headerShown: false}}
                    />
                    <RNDrawer.Screen
                        name="ResetPhone"
                        component={ResetPhone}
                        options={{headerShown: false}}
                    />
                    <RNDrawer.Screen
                        name="VerificationCode"
                        component={VerificationCode}
                        options={{headerShown: false}}
                    />
                    <RNDrawer.Screen
                        name="NewPassword"
                        component={NewPassword}
                        options={{headerShown: false}}
                    />
                </>
            ) : (
                <>
                    <RNDrawer.Screen
                        name="Home"
                        component={getNavigatorByRole()}
                        options={{headerShown: false}}
                    />
                    <RNDrawer.Screen
                        name="Setting"
                        component={Setting}
                        options={{headerShown: false}}
                    />
                    <RNDrawer.Screen
                        name="Delete"
                        component={Delete}
                        options={{headerShown: false}}
                    />

                    <RNDrawer.Screen
                        name="Notifications"
                        component={NotificationScreen}
                        options={{
                            headerShown: false,

                        }}
                    />

                    <RNDrawer.Screen
                        name="NotificationView"
                        component={NotificationView}
                        options={{
                            headerShown: false,
                        }}
                    />
                </>
            )}

            {/* Common screens */}
            <RNDrawer.Screen
                name="SignupSuccess"
                component={SignupSuccess}
                options={{headerShown: false}}
            />
            <RNDrawer.Screen
                name="Logout"
                component={Logout}
                options={{headerShown: false}}
            />
            <RNDrawer.Screen
                name="ResetSuccess"
                component={ResetSuccess}
                options={{headerShown: false}}
            />
        </RNDrawer.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: $theme.colors.primary,
        height: 64,
        paddingTop: 0,
    },
    createReportButton: {
        borderWidth:1,
        borderColor:'#c5c5c5',
        width: 45,
        height: 45,
        backgroundColor: '#FFF',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -20,
    },
    tabLabel: {
        fontSize: 12,
        color: '#fff',
    },
    avatarImage: {
        marginRight: 16,
    }
});

export default DrawerNavigation;

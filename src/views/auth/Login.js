import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {TextInput, Text, Button, Image} from '@components/elements';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import $endpoints from '@config/endpoints'
import httpClient from '@/services/api';

import { setCredentials, setLoading as setAuthLoading } from "@/store/slice/authSlice";
import {useDispatch} from 'react-redux';
import {setSessionUser} from "@/store/slice/userSlice";


const LoginScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const [email, setEmail] = useState('admin@dirac.mx');
    const [password, setPassword] = useState('password');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [formAuth, setFormAuth] = useState({email: null, password: null});
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleChangeForm = (name, value) => {
        setFormAuth(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };



    const onSubmit = async () => {
        try {
            setLoading(true);
            dispatch(setAuthLoading(true));

            const response = await httpClient.post($endpoints.auth.login, formAuth, 'error');

            if (response.data.token) {
                dispatch(setCredentials({
                    token: response.data.token,
                    permissions: response.data.permissions || [],
                    roles: response.data.roles || [],
                }));

                dispatch(setSessionUser({
                    id: response.data.user.id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    role:  response.data.roles || [],

                }));

            }
        } catch (error) {
            setLoading(false)
            dispatch(setAuthLoading(false));

        } finally {
            setLoading(false);
            dispatch(setAuthLoading(false));
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            padding: 35,
            gap: 20,
        },
        logo: {
            alignSelf: 'center',
            marginVertical: 32,
            top: 20,
        },
        titleContainer: {
            gap: 4,
            marginBottom: 5,
        },
        form: {
            gap: 15,
        },
        inputContainer: {
            gap: 0,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        divider: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
        },
        dividerLine: {
            flex: 1,
            height: 1,
            backgroundColor: theme.colors.outlineVariant,
        },
        dividerText: {
            paddingHorizontal: 16,
        },
        loginButton: {
            borderRadius: 4,
            paddingVertical: 4,
            elevation: 2
        },
        socialButtonsContainer: {
            gap: 0,
        },
        socialButton: {
            borderRadius: 6,
            marginVertical: 6,
            height: 48,
        },
        socialButtonContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            paddingHorizontal: 16,
        },
        socialIcon: {
            width: 20,
            height: 20,
            marginRight: 12,
            resizeMode: 'contain',
        },
        socialText: {
            fontSize: 16,
            flex: 1,
            textAlign: 'left',
        },
        googleButton: {
            borderWidth: 1,
            borderColor: '#bababa',
            backgroundColor: '#FFFFFF',

        },
        googleText: {
            color: '#616161',
        },
        appleButton: {
            backgroundColor: '#000000',
        },
        XButton: {
            backgroundColor: '#000000',
        },
        XText: {
            color: '#FFFFFF',
            fontSize: 15,
        },
        facebookButton: {
            backgroundColor: '#3b5998',
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logo}>
                    <Image
                        source={require('@assets/images/logos/logo.png')}
                        style={{width: 300, height: 80}}
                    />
                </View>

                <View style={styles.titleContainer}>
                    <Text variant="headlineMedium" style={{fontWeight: '600'}}>Iniciar sesión</Text>
                    <Text
                        variant="bodyLarge"
                        style={{color: theme.colors.onSurfaceVariant}}
                    >
                        Ingresa tus datos para acceder
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={{fontWeight: 'bold', color: theme.colors.primary}}>
                            Correo electrónico / Telefono
                        </Text>
                        <TextInput
                            mode="flat"

                            onChangeText={(value) => handleChangeForm('email_phone', value)}
                            placeholder="Ingresa tu correo o número telefonico"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            underlineColor={theme.colors.outline}
                            activeUnderlineColor={theme.colors.primary}
                            style={{backgroundColor: 'transparent'}}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.row}>
                            <Text style={{fontWeight: 'bold', color: theme.colors.primary}}>
                                Contraseña
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
                                <Text variant="bodyLarge"
                                      style={{color: theme.colors.onSurfaceVariant, fontSize: '12px'}}>
                                    Olvidaste tu contraseña?
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            mode="flat"
                            placeholder="*************"
                            onChangeText={(value) => handleChangeForm('password', value)}
                            secureTextEntry={secureTextEntry}
                            underlineColor={theme.colors.outline}
                            activeUnderlineColor={theme.colors.primary}
                            style={{backgroundColor: 'transparent'}}
                            right={
                                <TextInput.Icon
                                    icon={secureTextEntry ? 'eye-off' : 'eye'}
                                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                                />
                            }
                        />
                    </View>

                    <Button
                        mode="contained"
                        onPress={() => {
                            onSubmit();
                        }}
                        loading={loading}
                        style={styles.loginButton}
                    >
                        Iniciar sesión
                    </Button>

                    <View style={styles.row}>
                        <Text
                            variant="bodyLarge"
                            style={{color: theme.colors.onSurfaceVariant}}
                        >
                            ¿No tienes cuenta?
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>

                            <Text variant="bodyLarge" style={{color: theme.colors.primary, fontWeight: 'bold'}}
                            >
                                Regístrate
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine}/>
                        <Text
                            variant="bodyLarge"
                            style={[styles.dividerText, {color: theme.colors.onSurfaceVariant}]}
                        >
                            O inicia sesión con
                        </Text>
                        <View style={styles.dividerLine}/>
                    </View>

                    <View style={styles.socialButtonsContainer}>
                        {/* Google Button */}
                        <Button
                            mode="outlined"
                            onPress={() => {
                            }}
                            style={[styles.socialButton, styles.googleButton]}
                            contentStyle={styles.socialButtonContent}
                        >
                            <View style={styles.socialButtonContent}>
                                <Image
                                    source={require('@/assets/images/social/google.png')}
                                    style={styles.socialIcon}
                                />
                                <Text style={[styles.socialText, styles.googleText]}>
                                    Continuar con Google
                                </Text>
                            </View>
                        </Button>

                        {/* Apple Button */}
                        <Button
                            mode="contained"
                            onPress={() => {
                            }}
                            style={[styles.socialButton, styles.appleButton]}
                            contentStyle={styles.socialButtonContent}
                        >
                            <View style={styles.socialButtonContent}>
                                <Image
                                    source={require('@/assets/images/social/apple.png')}
                                    style={[styles.socialIcon, {tintColor: 'white'}]}
                                />
                                <Text style={[styles.socialText, {color: 'white'}]}>
                                    Continuar con Apple
                                </Text>
                            </View>
                        </Button>


                        <Button
                            mode="contained"
                            onPress={() => {
                            }}
                            style={[styles.socialButton, styles.XButton]}
                            contentStyle={styles.socialButtonContent}
                        >
                            <View style={styles.socialButtonContent}>
                                <Image
                                    source={require('@/assets/images/social/x.png')}
                                    style={styles.socialIcon}
                                />
                                <Text style={[styles.socialText, {color: 'white'}]}>
                                    Continuar con X
                                </Text>
                            </View>
                        </Button>

                        <Button
                            mode="contained"
                            onPress={() => {
                            }}
                            style={[styles.socialButton, styles.facebookButton]}
                            contentStyle={styles.socialButtonContent}
                        >
                            <View style={styles.socialButtonContent}>
                                <Image
                                    source={require('@/assets/images/social/facebook.png')}
                                    style={styles.socialIcon}
                                />
                                <Text style={[styles.socialText, {color: 'white'}]}>
                                    Continuar con Facebook
                                </Text>
                            </View>
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default LoginScreen;

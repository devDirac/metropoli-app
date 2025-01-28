import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Text, Button, Image} from '@components/elements';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import $endpoints from '@config/endpoints'
const LoginScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [formAuth, setFormAuth] = useState({email:null,password:null});
    const [loading, setLoading] = useState(false);

    const handleChangeForm = (name, value) => {
        setFormAuth(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };



 const onSubmit = ()=> {
        try {
            setLoading(true);
            api.postAwaiting($endpoints.auth.login, formAuth, true).then(response => {
                if (response.access_token !== undefined && response.access_token !== '') {
                    Toast.show({
                        type: 'success',
                        position: 'top',
                        text1: '¡Acceso correcto!',
                        text2: 'Accediendo',
                        visibilityTime: 2500,
                        onHide: () => {

                            console.log(response);
                            dispatch(setSessionAuth({token: response.access_token, lang: 'es'}));
                            dispatch(setSessionUser({
                                id: response.user.id,
                                name: response.user.name,
                                email: response.user.email,
                                admin: response.user.admin,

                            }));

                            setLoading(false);

                            navigation.reset({
                                index: 0,
                                routes: [{name: 'Principal'}],
                            });
                        }
                        // });
                    });
                }
            }).catch(error => {
                console.log(error);
                setLoading(false);
            })
        } catch (e) {
            console.log(e);
            setLoading(false);
        }

    }

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
            borderWidth:1,
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
                            Correo electrónico
                        </Text>
                        <TextInput
                            mode="flat"
                            value={email}
                            onChangeText={(value) => handleChangeForm('email', value)}
                            placeholder="example@email.com"
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
                            <Text
                                variant="bodyLarge"
                                onPress={() => {
                                }}
                                style={{color: theme.colors.onSurfaceVariant, fontSize: '12px'}}
                            >
                                Olvidaste tu contraseña?
                            </Text>
                        </View>
                        <TextInput
                            mode="flat"
                            value={password}
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
                        <Text
                            variant="bodyLarge"
                            onPress={() => {
                            }}
                            style={{color: theme.colors.primary, fontWeight: 'bold'}}
                        >
                            Regístrate
                        </Text>
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

                        {/* X Button */}
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

                        {/* Facebook Button */}
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

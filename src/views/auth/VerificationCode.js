import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Image, Alert
} from 'react-native'
import React, {useState, useCallback, useEffect} from 'react'
import {useNavigation} from '@react-navigation/native';
import {AppBar} from '@react-native-material/core';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import OtpInputs from 'react-native-otp-inputs';
import Clipboard from '@react-native-clipboard/clipboard';
import api from "@/services/api";
import Toast from "react-native-toast-message";
import $endpoints from '@config/endpoints';
import {useTheme} from 'react-native-paper';
import {useDispatch} from "react-redux";
import PropTypes from 'prop-types';
import {setCredentials} from "@/store/slice/authSlice";
import {setSessionUser} from "@/store/slice/userSlice";

export default function Otp({route}) {
    const theme = useTheme();
    const navigation = useNavigation();
    const params = route.params;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [counter, setCounter] = useState(0);
    const [formVerification, setFormVerification] = useState({
        token: null,
        ...params,
    });

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            padding: 35,
            flex: 1,
        },
        logo: {
            alignSelf: 'center',
            marginVertical: 32,
            top: 20,
        },
        titleContainer: {
            gap: 4,
            marginBottom: 25,
        },
        otpContainer: {
            paddingTop: 50,
        },
        counterContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
            alignSelf: 'center'
        },
        bottomContainer: {
            margin: 20
        },
        verifyButton: {
            borderRadius: 4,
            paddingVertical: 15,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center'
        },
        buttonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        },
        resendText: {
            color: theme.colors.primary,
            fontWeight: '500'
        }
    });

    useEffect(() => {
        const timer = counter > 0 && setInterval(() => {
            setCounter(counter - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [counter]);

    const resetPassword = () => {
        console.log('resetPassword',params);
        setLoading(true);
        api.post($endpoints.auth.forget_password, params).then(response => {
            console.log('response',response);
            setLoading(false);
        }).catch(error => {
            console.log('Error:', error);
            setLoading(false);
        });
    }

    const accountRegister = () => {
        api.post($endpoints.auth.resend_code, formVerification).then(response => {
            setLoading(false);
        }).catch(error => {
            setLoading(false);
        })
    }

    const verificationCode = () => {
        setLoading(true);

        if (formVerification.verification === 'reset-password') {
            handleChangeForm('type', (params?.email !== undefined) ? 'email' : 'phone');
            api.post($endpoints.auth.verify_code, formVerification,'error').then(response => {
                if (response?.data?.validation == true) {
                    setLoading(false);
                    navigation.navigate('NewPassword', formVerification)
                }
            }).catch(error => {
                console.log('error', error);

            }).finally(()=>{
                setLoading(false);
            })
        } else {

            api.post($endpoints.auth.verify_account, formVerification, false).then(response => {
                if (response.data.validation !== undefined && response.data.validation !== '') {
                    setFormVerification({code: null, email: formVerification?.email});
                    setLoading(false);

                    navigation.reset({
                        index: 0,
                        routes: [{name: 'Login'}],
                    });



                    Alert.alert('Cuenta registrada', 'Tu cuenta ha sido creada exitosamente, ahora puedes iniciar sesión con tus datos de acceso',
                        [{text: 'Entendido'},
                    ]);

                }
            }).catch(error => {
                setLoading(false);
            })
        }
    }

    const handleChangeForm = useCallback((name, value) => {
        setFormVerification(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }, []);

    const handleResendCode = () => {

        if (params.verification === 'register') {
            accountRegister();
            setCounter(30);
            return;
        }
        if (params.verification === 'reset-password') {
            resetPassword();
            setCounter(30);
            return;
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={styles.content}>
                    <AppBar
                        color={theme.colors.background}
                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icons name="chevron-left" color={theme.colors.onSurface} size={30}/>
                        </TouchableOpacity>}
                    />

                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={styles.titleContainer}>
                            <Text style={{fontSize: 24, fontWeight: '600', color: theme.colors.onSurface}}>
                                Verificación de cuenta
                            </Text>
                            <Text style={{color: theme.colors.onSurfaceVariant}}>
                                Por favor ingresa el código de verificación que enviamos a{' '}
                                <Text style={{color: theme.colors.onSurface, fontWeight: '500'}}>
                                    ({params?.email}{params?.phone})
                                </Text>
                            </Text>
                        </View>

                        <View style={styles.otpContainer}>
                            <OtpInputs
                                handleChange={(value) => {
                                    setFormVerification(prevState => ({
                                        ...prevState,
                                        code: value,
                                    }));
                                }}
                                Clipboard={Clipboard}
                                numberOfInputs={6}
                                selectionColor={theme.colors.primary}
                                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}
                                inputStyles={{
                                    borderRadius: 10,
                                    textAlign: 'center',
                                    height: 50,
                                    width: 50,
                                    fontSize: 20,
                                    borderWidth: 1,
                                    borderColor: theme.colors.outline,
                                    color: theme.colors.onSurface,
                                    fontWeight: 'bold'
                                }}
                            />
                        </View>

                        <View style={styles.counterContainer}>
                            {counter > 0 ? (
                                <Text style={{color: theme.colors.onSurfaceVariant}}>
                                    Reenviar código en:{' '}
                                    <Text style={{color: theme.colors.primary}}>{counter} segundos</Text>
                                </Text>
                            ) : (
                                <TouchableOpacity onPress={handleResendCode}>
                                    <Text style={styles.resendText}>Reenviar código</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>

                    <View style={styles.bottomContainer}>
                        <TouchableOpacity
                            style={styles.verifyButton}
                            disabled={loading}
                            onPress={verificationCode}
                        >
                            {loading && <ActivityIndicator size="small" color="white" style={{marginRight: 10}}/>}
                            <Text style={styles.buttonText}>Verificar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}


Otp.propTypes = {
    route: PropTypes.shape({
        params: PropTypes.shape({
            email: PropTypes.string,
            mode: PropTypes.oneOf(['reset-password', 'register']).isRequired,
            type: PropTypes.oneOf(['email', 'phone']),
        }).isRequired,
    }).isRequired,
};



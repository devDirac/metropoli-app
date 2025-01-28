import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import httpClient from '@/services/api';
import $endpoints from '@config/endpoints';
import {TextInput, Text, Button, Image} from '@components/elements';
import {useTheme, SegmentedButtons} from 'react-native-paper';
const Signup = ({route}) => {
    const navigation = useNavigation();
    const theme = useTheme();
    const params = route.params;
    const [value, setValue] = useState('email');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [formErrors, setFormErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: null,
        name: '',
        phone: '',
        password: null,
        mode: 'register',
        password_confirmation: null,
        ...params,
    });

    const handleChangeForm = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const accountRegister = () => {
        setLoading(true);
        httpClient.post($endpoints.auth.register, formData, false).then(response => {
            navigation.navigate('VerificationCode',formData);
        }).catch(error => {
            console.log(error);
            Alert.alert('Error', error.message, [{ text: 'Aceptar' }]);
            setLoading(false);
        }).finally(() => {
            setLoading(false);
        });
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
        loginButton: {
            borderRadius: 4,
            paddingVertical: 4,
            elevation: 2,
            marginTop: 15
        }
    });

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={styles.content}>
                    <View style={styles.logo}>
                        <Image
                            source={require('@assets/images/logos/logo.png')}
                            style={{width: 300, height: 80}}
                        />
                    </View>

                    <View style={styles.titleContainer}>
                        <Text variant="headlineMedium" style={{fontWeight: '600'}}>Crear cuenta</Text>
                        <Text variant="bodyLarge" style={{color: theme.colors.onSurfaceVariant}}>
                            Registra tus datos para comenzar
                        </Text>
                    </View>

                    <SegmentedButtons
                        value={value}
                        onValueChange={setValue}
                        style={{
                        }}
                        buttons={[
                            {
                                value: 'email',
                                label: 'Email',
                                icon: 'email',
                                style: {
                                    backgroundColor: value === 'email' ? '#E6E6FA' : 'transparent'
                                }
                            },
                            {
                                value: 'phone',
                                label: 'Teléfono',
                                icon: 'phone',
                                style: {
                                    backgroundColor: value === 'phone' ? '#E6E6FA' : 'transparent'
                                }
                            },
                        ]}
                        theme={{
                            colors: {
                                primary: '#084D6E',
                                secondaryContainer: '#E6E6FA',
                                onSecondaryContainer: '#084D6E'
                            }
                        }}
                    />

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={{fontWeight: 'bold', color: theme.colors.primary}}>
                                Nombre(s)
                            </Text>
                            <TextInput
                                mode="flat"
                                value={formData.name}
                                onChangeText={(value) => handleChangeForm('name', value)}
                                placeholder="Ingresa tu nombre"
                                underlineColor={theme.colors.outline}
                                activeUnderlineColor={theme.colors.primary}
                                style={{backgroundColor: 'transparent'}}
                                error={!!formErrors?.name}
                            />
                        </View>

                        {value === 'email' ? (
                            <View style={styles.inputContainer}>
                                <Text style={{fontWeight: 'bold', color: theme.colors.primary}}>
                                    Correo electrónico
                                </Text>
                                <TextInput
                                    mode="flat"
                                    value={formData.email}
                                    onChangeText={(value) => handleChangeForm('email', value)}
                                    placeholder="example@email.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    underlineColor={theme.colors.outline}
                                    activeUnderlineColor={theme.colors.primary}
                                    style={{backgroundColor: 'transparent'}}
                                    error={!!formErrors?.email}
                                />
                            </View>
                        ) : (
                            <View style={styles.inputContainer}>
                                <Text style={{fontWeight: 'bold', color: theme.colors.primary}}>
                                    Número telefonico
                                </Text>
                                <TextInput
                                    mode="flat"
                                    value={formData.phone}
                                    onChangeText={(value) => handleChangeForm('phone', value)}
                                    placeholder="Ingresa tu número telefonico"
                                    keyboardType="phone-pad"
                                    autoCapitalize="none"
                                    underlineColor={theme.colors.outline}
                                    activeUnderlineColor={theme.colors.primary}
                                    style={{backgroundColor: 'transparent'}}
                                    error={!!formErrors?.phone}
                                />
                            </View>
                        )}

                        <View style={styles.inputContainer}>
                            <Text style={{fontWeight: 'bold', color: theme.colors.primary}}>
                                Contraseña
                            </Text>
                            <TextInput
                                mode="flat"
                                value={formData.password}
                                placeholder="*************"
                                onChangeText={(value) => handleChangeForm('password', value)}
                                secureTextEntry={secureTextEntry}
                                underlineColor={theme.colors.outline}
                                activeUnderlineColor={theme.colors.primary}
                                style={{backgroundColor: 'transparent'}}
                                error={!!formErrors?.password}
                                right={
                                    <TextInput.Icon
                                        icon={secureTextEntry ? 'eye-off' : 'eye'}
                                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                                    />
                                }
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={{fontWeight: 'bold', color: theme.colors.primary}}>
                                Confirmar contraseña
                            </Text>
                            <TextInput
                                mode="flat"
                                value={formData.password_confirmation}
                                placeholder="*************"
                                onChangeText={(value) => handleChangeForm('password_confirmation', value)}
                                secureTextEntry={secureTextEntry}
                                underlineColor={theme.colors.outline}
                                activeUnderlineColor={theme.colors.primary}
                                style={{backgroundColor: 'transparent'}}
                                error={!!formErrors?.password_confirmation}
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
                            onPress={accountRegister}
                            loading={loading}
                            style={styles.loginButton}
                        >
                            Registrar
                        </Button>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 20
                        }}>
                            <Text
                                variant="bodyLarge"
                                style={{color: theme.colors.onSurfaceVariant}}
                            >
                                ¿Ya tienes cuenta?
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text variant="bodyLarge"
                                      style={{color: theme.colors.primary, fontWeight: 'bold', marginLeft: 5}}>
                                    Inicia sesión
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default Signup;

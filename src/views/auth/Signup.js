import {
    View,
    Text,
    SafeAreaView,
    TextInput,
    Dimensions,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native'
import React, {useState, useContext, useEffect} from 'react'

import {useNavigation} from '@react-navigation/native';
import {AppBar} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/Feather'
import {Input, Select} from "@components/elements";
import api from "@/services/api";
import $endpoints from '@config/endpoints';

import Toast from "react-native-toast-message";

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Signup() {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const theme = useContext(themeContext);
    const navigation = useNavigation();
    const [isFocused, setIsFocused] = useState(false)
    const [formErrors, setFormErrors] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
            email: null,
            password: null,
            password_confirmation: null,
            name: '',
            verification: 'register',
        aviso_privacidad: 0,
        publicidad: 0,
        path_recibo: 0,
        compartir_datos: 0

        }
    );


    const accountRegister = () => {
        setLoading(true);

        api.postAwaiting($endpoints.auth.register, formData).then(response => {
            console.log(response);
            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Cuenta creada',
                text2: response.message,
                visibilityTime: 3000,
                onHide: () => {
                    setLoading(false);
                    setFormData({
                            email: null,
                            password: null,
                            password_confirmation: null,
                            name: '',
                            verification: 'register',
                            aviso_privacidad: 0,
                            publicidad: 0,
                            path_recibo: 0,
                            compartir_datos: 0

                        }
                    );
                    navigation.navigate('Login');
                }
            });

        }).catch(error => {
            console.log(error);
            setLoading(false);
            updateFormErrors(error.errors);
        });
    }

    const updateFormErrors = (errors) => {
        const newErrors = Object.keys(errors).reduce((acc, key) => {
            acc[key] = errors[key][0];
            return acc;
        }, {});
        setFormErrors(newErrors);
    };



    const handleChangeForm = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {

    }, []);

    return (
        <SafeAreaView style={[style.area, {backgroundColor: theme.bg,}]}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={[style.main, {backgroundColor: theme.bg, marginTop: 10}]}>

                    <AppBar
                        color={theme.bg}
                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Icon name="chevron-back" color={theme.txt} size={30}/>
                        </TouchableOpacity>
                        }/>

                    <ScrollView showsVerticalScrollIndicator={false}>

                        <Text style={[style.title, {color: theme.txt,}]}>Registrar cuenta</Text>
                        <Text style={[style.m14, {color: Colors.disable,}]}>Regístrate para comenzar</Text>

                        <Input icon="account" hasError={!!formErrors?.name}
                               onTextChange={(value) => handleChangeForm('name', value)} value={formData?.name}
                               label="Nombres"/>

                        <Input icon="account" hasError={!!formErrors?.AP_paterno}
                               onTextChange={(value) => handleChangeForm('AP_paterno', value)} value={formData?.AP_paterno}
                               label="Apellido paterno"/>
                        <Input icon="account" hasError={!!formErrors?.AP_materno}
                               onTextChange={(value) => handleChangeForm('AP_materno', value)} value={formData?.AP_materno}
                               label="Apellido materno"/>


                        <Input icon="email" hasError={!!formErrors?.email}
                               onTextChange={(value) => handleChangeForm('email', value)} keyboardType="email-address"
                               value={formData?.email} label="Correo electrónico"/>

                        <View style={[style.inputContainer, {
                            borderColor: isFocused === 'Password' ? Colors.primary : theme.border,
                            marginTop: 20
                        }]}>
                            <Icons name='key' size={25}
                                   color={isFocused === 'Password' ? Colors.primary : Colors.disable}></Icons>
                            <TextInput placeholder='Contraseña'
                                       secureTextEntry={isPasswordVisible}
                                       onFocus={() => setIsFocused('Password')}
                                       onBlur={() => setIsFocused(false)}
                                       value={formData.password}
                                       onChangeText={(value) => handleChangeForm('password', value)}
                                       selectionColor={Colors.primary}
                                       placeholderTextColor={Colors.disable}
                                       style={[style.r14, {paddingHorizontal: 10, color: theme.txt, flex: 1}]}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Icon name={isPasswordVisible ? 'eye-off' : 'eye'}
                                      color={isFocused === 'Password' ? Colors.primary : Colors.disable} size={20}/>
                            </TouchableOpacity>
                        </View>

                        <View style={[style.inputContainer, {
                            borderColor: isFocused === 'Password' ? Colors.primary : theme.border,
                            marginTop: 20
                        }]}>
                            <Icons name='key' size={25}
                                   color={isFocused === 'Password' ? Colors.primary : Colors.disable}></Icons>
                            <TextInput placeholder='Confirmar contraseña'
                                       secureTextEntry={isPasswordVisible}
                                       onFocus={() => setIsFocused('Password')}
                                       onBlur={() => setIsFocused(false)}
                                       value={formData.password_confirmation}
                                       onChangeText={(value) => handleChangeForm('password_confirmation', value)}
                                       selectionColor={Colors.primary}
                                       placeholderTextColor={Colors.disable}
                                       style={[style.r14, {paddingHorizontal: 10, color: theme.txt, flex: 1}]}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Icon name={isPasswordVisible ? 'eye-off' : 'eye'}
                                      color={isFocused === 'Password' ? Colors.primary : Colors.disable} size={20}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginTop: 30}}>
                            <TouchableOpacity disabled={loading} onPress={() => accountRegister()}
                                              style={[style.btn, {
                                                  flexDirection: 'row',
                                                  alignItems: 'center',
                                                  justifyContent: 'center'
                                              }]}>
                                {loading && <ActivityIndicator size="small" color="white" style={{marginRight: 5}}/>}
                                <Text style={style.btntxt}> Registrar</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 20,
                            marginVertical: 40
                        }}>
                            <View style={[style.divider, {flex: 1, backgroundColor: theme.border}]}></View>
                            <Text style={[style.m14, {color: Colors.disable, marginHorizontal: 10,}]}>o</Text>
                            <View style={[style.divider, {flex: 1, backgroundColor: theme.border}]}></View>
                        </View>


                        <View
                            style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 40, marginBottom: 10}}>
                            <Text style={[style.m14, {color: Colors.disable}]}>¿Ya tienes una cuenta?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={[style.b14, {color: Colors.primary,fontWeight: 'bold',textDecorationLine: 'underline'}]}> Inicia sesión</Text>
                            </TouchableOpacity>
                        </View>


                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

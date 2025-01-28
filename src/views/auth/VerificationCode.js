import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground,
    StatusBar,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator
} from 'react-native'
import React, {useState, useContext, useEffect, useCallback} from 'react'
import { useNavigation } from '@react-navigation/native';

import { AppBar } from '@react-native-material/core';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import OtpInputs from 'react-native-otp-inputs'
import Clipboard from '@react-native-clipboard/clipboard'
import api from "@/services/api";
import Toast from "react-native-toast-message";
import $endpoints from '@config/endpoints';

import {setSessionAuth} from "@/store/slice/authSlice";
import {setSessionUser, setUser} from "@/store/slice/userSlice";
import {useDispatch} from "react-redux";

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width

export default function Otp({route}) {
    const navigation = useNavigation();
    const params = route.params;
    const dispatch = useDispatch();

    const [loading,setLoading]= useState(false);
    const [counter, setCounter] = useState(0); // Inicializa el contador con el valor deseado
    const [formVerification, setFormVerification] = useState({
        token:null,
        email:params?.email,
        verification:params?.verification,
        type:params?.type
    });

    useEffect(() => {
        const timer = counter > 0 && setInterval(() => {
            setCounter(counter - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [counter]);



    const  resetPassword = ()=> {
        setLoading(true);

        api.postAwaiting($endpoints.auth.reset_password, params).then(response => {
            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Codigo de verificación enviado',
                text2: response.message,
                visibilityTime:3000,
                onHide: () => {

                    setLoading(false);
                }
            });

        }).catch(error=>{
            console.log('Error:',error);
            setLoading(false);
        });
    }

    const  accountRegister = ()=> {
        api.postAwaiting($endpoints.user.app.register, params).then(response => {
            Toast.show({
                type: 'success', // 'success', 'error', 'info', 'warning'
                position: 'top',
                text1: '!Codigo de verificación enviado!',
                text2: response.message,
                visibilityTime:3000,

                // });
            });

        }).catch(error=>{
            console.log(error);
        })
    }


    const  verificationCode = ()=> {
        setLoading(true);


        if(formVerification.verification==='reset-password'){

            handleChangeForm('type',(params?.email!==undefined)?'email':'phone'),
            api.postAwaiting($endpoints.auth.validate_code, formVerification).then(response => {

                if(response?.validacion ==true) {
                    setLoading(false);
                    navigation.navigate('NewPassword', formVerification)
                }else{
                    Toast.show({
                        type: 'error', // 'success', 'error', 'info', 'warning'
                        position: 'top',
                        text1: 'Código de verificación invalido',
                        text2: 'El código que has ingresado es invalido',
                        visibilityTime:3000,

                        // });
                    });
                    setLoading(false);

                }

            }).catch(error=>{
                console.log('errpr',error);
                console.log(error);
                setLoading(false);
            })
        }else {
            console.log('verification account code');

            api.postAwaiting($endpoints.auth.validate_code, formVerification).then(response => {

                console.log('response',response);
                if (response.data.token !== undefined && response.data.token !== '') {

                    setFormVerification({token: null, email: params?.email});
                    setLoading(false);

                    navigation.reset({
                        index: 0,
                        routes: [{name: 'SignupSuccess'}],
                    });
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
            setCounter(30); // Reinicia el contador después de enviar el código de verificación
            return;
        }

        if (params.verification === 'reset-password') {
            resetPassword();
            setCounter(30); // Reinicia el contador después de enviar el código de verificación
            return;
        }
    }



    return (
        <SafeAreaView >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null} >
                <View >
                    <AppBar

                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icons name="chevron-left"  size={30} />
                        </TouchableOpacity>
                        } />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={[style.subtitle, { color: theme.txt, marginTop: 15 }]}>Verificación de cuenta</Text>
                        <Text style={[style.m14, { color: Colors.disable, marginTop: 10 }]}>Por favor ingresa el código de verificación, que enviamos a <Text style={{ color: theme.txt }}>{params?.email} </Text></Text>
                        <View style={{ paddingTop: 50 }}>
                            <OtpInputs
                                handleChange={(value) => {
                                    setFormVerification(prevState => ({
                                        ...prevState,
                                        token: value,
                                    }));
                                }}                                Clipboard={Clipboard}
                                numberOfInputs={6}
                                selectionColor={Colors.primary}
                                style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}
                                inputStyles={{
                                    // backgroundColor: theme.bg,
                                    borderRadius: 10,
                                    textAlign: 'center',
                                    height: 50,
                                    width: 50,
                                    fontSize: 20,
                                    borderWidth: 1,
                                    fontWeight: 'bold'
                                }}
                             />
                        </View>

                        {counter > 0 &&(
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginVertical: 20,
                                alignSelf: 'center'
                            }}>
                                <Text>Reenviar codigo en: </Text>
                                <TouchableOpacity>
                                    <Text >{counter} segundos</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {counter < 1 &&(

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginVertical: 20,
                                alignSelf: 'center'
                            }}>
                                <TouchableOpacity onPress={()=>handleResendCode()}>
                                    <Text >Reenviar codigo</Text>
                                </TouchableOpacity>
                            </View>

                        )}
                    </ScrollView>
                </View>
                <View style={{margin:20}}>
                    <TouchableOpacity disabled={loading} onPress={() =>verificationCode()}
                                      style={[style.btn,{ flexDirection: 'row', alignItems: 'center' ,      justifyContent: 'center'}]}>
                        {loading && <ActivityIndicator size="small" color="white" style={{ marginRight: 5}} />}
                        <Text style={style.btntxt}>  Verificar</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

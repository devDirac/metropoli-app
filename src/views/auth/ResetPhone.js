import {
    View,
    Text,
    SafeAreaView,
    TextInput,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native'
import React, {useState, useContext, useRef} from 'react';
import { AppBar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/Feather'
import api from "@/services/api";
import Toast from "react-native-toast-message";
import {Input} from "@components/elements";
import $endpoints from '@config/endpoints';

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

import PhoneInput from "react-native-phone-number-input";

export default function ResetEmail() {

    const navigation = useNavigation();
    const [isFocused, setIsFocused] = useState(false)
    const [loading,setLoading]= useState(false);
    const [formData, setFormData] = useState({phone:null,verification:'reset-password',type:'phone'});
    const [formErrors, setFormErrors] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState('')
    const phoneInput = useRef(null);

    const  resetPassword = ()=> {
        setLoading(true);
        console.log(formData);
        api.postAwaiting($endpoints.auth.reset_password, formData).then(response => {
            console.log(response);
            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Codigo de verificación enviado',
                text2: response.message,
                visibilityTime:3000,
                onHide: () => {
                    setLoading(false);
                    setFormData({phone:null,verification:'reset-password'});
                    navigation.navigate('VerificationCode',formData); // Cambia 'YourTargetView' por el nombre de tu vista destino
                }
            });

        }).catch(error=>{
            console.log('Error:',error);
            setLoading(false);
        });
    }

    const handleChangeForm = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <SafeAreaView >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View >

                    <AppBar

                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.navigate('Reset')}>
                            <Icon name="chevron-back"
                                // style={{backgroundColor:Colors.secondary,}}
                                 size={30}
                            />
                        </TouchableOpacity>
                        } />


                    <Text >Restablecer la contraseña</Text>
                    <Text >Introduce tu número de telefono, te enviaremos el código de confirmación</Text>
                    <View style={{ paddingTop: 20 }}>
                    <PhoneInput

                        ref={phoneInput}
                        defaultValue={phoneNumber}
                        defaultCode="MX"
                        layout="first"
                        withShadow
                        placeholder={'Número de telefono'}
                        textInputProps={{ placeholderTextColor: '#9E9E9E' }}containerStyle={{
                            height: 50,
                            width: '100%',
                            borderRadius: 10,
                            borderWidth: 1,

                        }}
                        textContainerStyle={{
                            paddingVertical: 0,
                            borderRadius: 10,
                        }}
                        onChangeFormattedText={text => {
                            handleChangeForm('phone',text);
                        }}
                    />

                    </View>
                    <View style={{marginTop:30,flex:1,justifyContent:'flex-end',marginBottom:30}}>
                        <TouchableOpacity disabled={loading} onPress={() =>resetPassword()}>
                            {loading && <ActivityIndicator size="small" color="white" style={{ marginRight: 5}} />}
                            <Text >  Continuar</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

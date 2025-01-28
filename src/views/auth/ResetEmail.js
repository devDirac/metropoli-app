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
import React, { useState, useContext } from 'react'

import { useNavigation } from '@react-navigation/native';
import { AppBar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import api from "@/services/api";
import Toast from "react-native-toast-message";
import {Input} from "@components/elements";

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height
import $endpoints from '@config/endpoints'

export default function ResetEmail() {

    const navigation = useNavigation();
    const [isFocused, setIsFocused] = useState(false)
    const [loading,setLoading]= useState(false);
    const [formData, setFormData] = useState({email:null,verification:'reset-password',type:'email'});
    const [formErrors, setFormErrors] = useState([]);


    const  resetPassword = ()=> {
        setLoading(true);
        api.postAwaiting($endpoints.auth.reset_password, formData,true).then(response => {
            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Codigo de verificación enviado',
                text2: response.message,
                visibilityTime:3000,
                onHide: () => {
                    setLoading(false);
                    setFormData({email:null,verification:'reset-password'});
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



                    <Input icon="email" hasError={!!formErrors?.email} onTextChange={(value) => handleChangeForm('email', value)} keyboardType="email-address"  value={formData?.email} label="Correo electronico" />


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

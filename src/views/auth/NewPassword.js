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
import Icons from 'react-native-vector-icons/Feather'
import api from "@/services/api";

import {useDispatch} from "react-redux";


import $endpoints from '@config/endpoints';
import Toast from 'react-native-toast-message';


const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function NewPassword({route}) {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [isFocused, setIsFocused] = useState(false)
    const params = route.params;
    const [formData, setFormData] = useState({
        token:params?.token,
        email:params?.email,
        type:params?.type,

    });
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [loading,setLoading]= useState(false);

    const handleChangeForm = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    const updatePassword =() => {
        setLoading(true);

        // Eliminamos la confirmación de contraseña ya que no se valida en la API
        delete formData.password_confirmation;

        api.postAwaiting($endpoints.auth.validate_code, formData).then(response => {

            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Contraseña actualizada',
                text2: 'La contraseña se ha actualizado correctamente',
                visibilityTime:3000,
                onHide: () => {

                    setLoading(true);
                    navigation.navigate('Login')

                }
            });


        }).catch(error => {
            setLoading(false);

        })
    }

    const checkPasswordStrength = (password) => {
        let strength = '';
        const lengthRegex = /.{8,}/;
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (lengthRegex.test(password) &&
            uppercaseRegex.test(password) &&
            lowercaseRegex.test(password) &&
            numberRegex.test(password) &&
            specialCharRegex.test(password)) {
            strength = 'strong';
        } else if (lengthRegex.test(password) &&
            (uppercaseRegex.test(password) || lowercaseRegex.test(password)) &&
            (numberRegex.test(password) || specialCharRegex.test(password))) {
            strength = 'medium';
        } else {
            strength = 'weak';
        }

        return strength;
    };

    return (
        <SafeAreaView >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View >

                    <AppBar

                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.navigate('ResetEmail')}>
                            <Icon name="chevron-back" size={30}/>
                        </TouchableOpacity>
                        } />

                    <ScrollView showsVerticalScrollIndicator={false} >


                        <View >
                            <TextInput placeholder='Nueva contraseña'
                                       secureTextEntry={isPasswordVisible}
                                       onFocus={() => setIsFocused('Password')}
                                       onBlur={() => setIsFocused(false)}
                                       selectionColor={Colors.primary}
                                       placeholderTextColor={Colors.disable}
                                       style={[style.r14, { paddingHorizontal: 10, color: theme.txt, flex: 1 }]}
                                       onChangeText={(text) => {
                                           handleChangeForm('password', text);
                                           setPasswordStrength(checkPasswordStrength(text));
                                       }}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} >
                                <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} color={isFocused === 'Password' ? Colors.primary : Colors.disable} size={20} />
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                            <View style={{height:7,flex:1,borderRadius:2,backgroundColor: passwordStrength === 'strong' ? 'green' : passwordStrength === 'medium' ? 'orange' : 'red'}}></View>
                            <View style={{marginHorizontal:3}}></View>
                            <View style={{height:7,flex:1,borderRadius:2,backgroundColor: passwordStrength === 'strong' ? 'green' : passwordStrength === 'medium' ? 'orange' : theme.border}}></View>
                            <View style={{marginHorizontal:3}}></View>
                            <View style={{height:7,flex:1,borderRadius:2,backgroundColor: passwordStrength === 'strong' ? 'green' : theme.border}}></View>
                            <View style={{marginHorizontal:3}}></View>
                            <View style={{marginHorizontal:5}}></View>
                            <Text >{passwordStrength}</Text>
                        </View>

                        <Text >Confirmar contraseña</Text>

                        <View >
                            <TextInput placeholder='Confirmar contraseña'
                                       secureTextEntry={!isPasswordVisible1}
                                       onFocus={() => setIsFocused('Confirm Password')}
                                       onBlur={() => setIsFocused(false)}
                                       onChangeText={(text) => {
                                           handleChangeForm('password_confirmation', text);
                                           setPasswordsMatch(formData.password === text);
                                       }}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible1(!isPasswordVisible1)} >
                                <Icon name={isPasswordVisible1 ? 'eye-off' : 'eye'} color={isFocused === 'Confirm Password' ? Colors.primary : Colors.disable} size={20} />
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                            {!passwordsMatch && (
                                <>
                                    <View ></View>
                                    <Text >Las contraseñas no coinciden</Text>
                                </>
                            )}
                        </View>

                        <View style={{marginTop:30}}>
                            <TouchableOpacity disabled={loading} onPress={() =>updatePassword()}>
                                {loading && <ActivityIndicator size="small" color="white" style={{ marginRight: 5}} />}
                                <Text >  Restablecer cuenta</Text>
                            </TouchableOpacity>
                        </View>


                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

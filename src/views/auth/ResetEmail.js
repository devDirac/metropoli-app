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
    ActivityIndicator,
    StyleSheet
} from 'react-native'
import React, { useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import { AppBar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/Feather';
import api from "@/services/api";
import Toast from "react-native-toast-message";
import {Input} from "@components/elements";
import { useTheme } from 'react-native-paper';

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height
import $endpoints from '@config/endpoints'
import httpClient from "@/services/api";

export default function ResetPhone() {
    const theme = useTheme();
    const navigation = useNavigation();
    const [isFocused, setIsFocused] = useState(false)
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({email:null, verification:'reset-password', type:'email'});
    const [formErrors, setFormErrors] = useState([]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            padding: 35,
            gap: 20,
            paddingTop:10,
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
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            paddingVertical: 10,
            marginBottom: 15,
        },
        input: {
            flex: 1,
            paddingHorizontal: 10,
            color: theme.colors.onSurface,
        },
        bottomContainer: {
            marginTop: 'auto',
        },
        continueButton: {
            borderRadius: 4,
            paddingVertical: 15,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            marginBottom: 15,
        },
        buttonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        },
        backButton: {
            alignItems: 'center',
            padding: 10,
            marginBottom: 20,
        },
        backText: {
            color: theme.colors.primary,
            fontSize: 16,
            fontWeight: '500',
        }
    });

    const resetPassword = () => {
        setLoading(true);
        httpClient.post($endpoints.auth.forget_password, formData, true).then(response => {
            console.log(response);
            setLoading(false);
            setFormData({email:null, verification:'reset-password'});
            navigation.navigate('VerificationCode', formData);

        }).catch(error => {
            console.log('Error:', error);
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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={styles.content}>
                    <AppBar
                        color={theme.colors.background}
                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.navigate('Reset')}>
                            <Icon name="chevron-back" color={theme.colors.onSurface} size={30}/>
                        </TouchableOpacity>}
                    />



                    <View style={styles.titleContainer}>
                        <Text style={{fontSize: 24, fontWeight: '600', color: theme.colors.onSurface}}>
                            Recuperar contraseña
                        </Text>
                        <Text style={{color: theme.colors.onSurfaceVariant}}>
                            Ingresa tu correo electrónico para recuperar tu contraseña
                        </Text>
                    </View>

                    <View style={[styles.inputContainer, {
                        borderColor: isFocused ? theme.colors.primary : theme.colors.outline
                    }]}>
                        <Icons name='mail' size={20} color={isFocused ? theme.colors.primary : theme.colors.outline}/>
                        <TextInput
                            placeholder='Correo electrónico'
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            value={formData.email}
                            onChangeText={(value) => handleChangeForm('email', value)}
                            keyboardType="email-address"
                            placeholderTextColor={theme.colors.outline}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.bottomContainer}>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={resetPassword}
                            disabled={loading}
                        >
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                {loading && <ActivityIndicator size="small" color="white" style={{marginRight: 10}}/>}
                                <Text style={styles.buttonText}>Continuar</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.navigate('Reset')}
                        >
                            <Text style={styles.backText}>Regresar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

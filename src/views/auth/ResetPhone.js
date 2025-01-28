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
import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { AppBar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/Feather';
import api from "@/services/api";
import Toast from "react-native-toast-message";
import { useTheme } from 'react-native-paper';
import $endpoints from '@config/endpoints';

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function ResetPhone() {
    const theme = useTheme();
    const navigation = useNavigation();
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        phone: null,
        verification: 'reset-password',
        type: 'phone'
    });

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
        api.post($endpoints.auth.forget_password, formData).then(response => {
            setLoading(false);
            setFormData({phone: null, verification: 'reset-password'});
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
                            Restablecer la contraseña
                        </Text>
                        <Text style={{color: theme.colors.onSurfaceVariant}}>
                            Introduce tu número de teléfono, te enviaremos el código de confirmación
                        </Text>
                    </View>

                    <View style={[styles.inputContainer, {
                        borderColor: isFocused ? theme.colors.primary : theme.colors.outline
                    }]}>
                        <Icons name='phone' size={20} color={isFocused ? theme.colors.primary : theme.colors.outline}/>
                        <TextInput
                            placeholder='Número de teléfono'
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            value={formData.phone}
                            onChangeText={(value) => handleChangeForm('phone', value)}
                            keyboardType="phone-pad"
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

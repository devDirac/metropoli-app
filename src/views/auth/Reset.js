import { View, Text,  Dimensions, TouchableOpacity, SafeAreaView,  KeyboardAvoidingView, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Ionicons';
import { AppBar } from '@react-native-material/core';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width

export default function Reset() {
    const navigation = useNavigation();

    return (
        <SafeAreaView >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View >
                    <AppBar

                        elevation={0}
                        leading={<TouchableOpacity onPress={() => navigation.navigate('Login')} >
                            <Icons name="chevron-left"  size={30} />
                        </TouchableOpacity>
                        } />
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <Text >Has olvidado tu contraseña</Text>
                        <Text >Selecciona método de recuperación de contraseña</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ResetEmail',{type:'email'})}
                        style={{ marginTop: 20, paddingHorizontal: 12,  borderWidth: 1, borderRadius: 12, flexDirection: 'row' ,paddingVertical:15}}>
                            <Icon name="mail-outline" color={Colors.disable} size={25} />
                            <View style={{ marginLeft: 12,flex:1 }}>
                                <Text>Email</Text>
                                <Text>Introduce tu email, te enviaremos el código de confirmación</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={() => navigation.navigate('ResetPhone',{type:'phone'})}
                        style={{ marginTop: 10, paddingHorizontal: 12, borderWidth: 1, borderRadius: 12, flexDirection: 'row' ,paddingVertical:15}}>
                            <Icon name="call-outline" size={25} />
                            <View style={{ marginLeft: 12,flex:1 }}>
                                <Text >Telefono</Text>
                                <Text >Introduce tu número de teléfono, te enviaremos el código de confirmación</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

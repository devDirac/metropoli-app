import { View, Text, SafeAreaView, TextInput, Dimensions, StatusBar, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useContext } from 'react'

import { useNavigation } from '@react-navigation/native';
import { AppBar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/Feather'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function ResetSuccess() {

    const navigation = useNavigation();

  return (
    <SafeAreaView >
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
    <View >

        <AppBar

            elevation={0}
            leading={<TouchableOpacity onPress={() => navigation.reset({
                index: 0,
                routes: [{name: 'MyTabs'}],
            })}>
              <Icon name="close" size={30} />
            </TouchableOpacity>
        } />

        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        </View>
        <View style={{flex:0.2}}>
            <View style={{marginTop:30}}>
                <TouchableOpacity onPress={() => navigation.reset({
                    index: 0,
                    routes: [{name: 'MyTabs'}],
                })}>
                <Text >Ir al inicio</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

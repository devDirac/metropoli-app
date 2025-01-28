import { View, Text, Image, Dimensions, TouchableOpacity, SafeAreaView, ImageBackground, StatusBar, } from 'react-native'
import React, { useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@theme/color'
import themeContext from '@theme/themeContex'
import style from '@theme/style'
import AsyncStorage from "@react-native-async-storage/async-storage";

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width

export default function IntroItem({ item }) {
    const navigation = useNavigation();
    const theme = useContext(themeContext);

    const handleSkip=()=>{
        AsyncStorage.setItem('isFirstLaunch', 'false').then((r) =>{
            navigation.navigate('Start')
        })
    }

    return (
        <SafeAreaView style={{ width: width, backgroundColor: theme.bg }}>
            <StatusBar backgroundColor="transparent" translucent={true} />
            <View style={{ alignItems: 'flex-end', marginHorizontal: 10, marginTop: 40 }}>
                <TouchableOpacity onPress={() => handleSkip()}>
                    <Text style={[style.b14,{color:theme.txt}]}>Saltar</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 3,justifyContent:'center' }}>
                <Image source={item.img} style={{ width: width, height: height / 2.3, resizeMode: 'stretch', alignSelf: 'center' }} />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 20, backgroundColor: theme.bg, borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
                <View >
                    <Text style={[style.title, { textAlign: 'center', color: theme.txt, }]}>{item.title1}</Text>
                    <Text style={[style.m14, { textAlign: 'center', color: Colors.disable,marginTop:10 }]}>{item.subtitle}</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

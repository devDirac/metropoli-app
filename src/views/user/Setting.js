import { View, Text, SafeAreaView, TextInput, Dimensions, StatusBar, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Switch } from 'react-native'
import React, { useState, useContext } from 'react'

import { useNavigation } from '@react-navigation/native';
import { AppBar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/Feather'
import { EventRegister } from 'react-native-event-listeners'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Setting() {

    const navigation = useNavigation();
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <SafeAreaView >
            <View >

                <AppBar
                    title='Setting'
                    centerTitle='true'
                    elevation={0}
                    leading={<TouchableOpacity onPress={() => navigation.navigate('MyTabs')}>
                        <Icons name="chevron-left" size={24} />
                    </TouchableOpacity>
                    } />

                <ScrollView showsVerticalScrollIndicator={false} >

                    <Text >General</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ height: height / 18, width: width / 8,  borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name='eye-outline' size={20} ></Icon>
                        </View>
                        <Text >Modo Oscuro</Text>
                        <Switch
                            style={{ marginRight: 7 }}
                           ios_backgroundColor="#3e3e3e"
                            onValueChange={
                                (value) => {
                                  //  setDarkMode(value);
                                    EventRegister.emit('ChangeTheme', value)
                                }
                            }
                        />
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Notification')}
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ height: height / 18, width: width / 8,  borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Icons name='bell' size={20} color={Colors.primary}></Icons>
                        </View>
                        <Text>Notification</Text>
                        <Icons name="chevron-right" color={Colors.disable} size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('History')}
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ height: height / 18, width: width / 8, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Icons name='credit-card' size={20} ></Icons>
                        </View>
                        <Text >Transaction History</Text>
                        <Icons name="chevron-right"  size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Account')}
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ height: height / 18, width: width / 8, backgroundColor: theme.btn, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name='person-outline' size={20} ></Icon>
                        </View>
                        <Text >Editar Cuenta</Text>
                        <Icons name="chevron-right"  size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ height: height / 18, width: width / 8, backgroundColor: theme.btn, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Icons name='key' size={20} ></Icons>
                        </View>
                        <Text>Login and Security</Text>
                        <Icons name="chevron-right" size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Info')}
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ height: height / 18, width: width / 8,  borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Icons name='info' size={20} ></Icons>
                        </View>
                        <Text >General Information</Text>
                        <Icons name="chevron-right"  size={24} />
                    </TouchableOpacity>

                    <Text >Other</Text>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ height: height / 18, width: width / 8,  borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Icons name='help-circle' size={20} ></Icons>
                        </View>
                        <Text >Help</Text>
                        <Icons name="chevron-right" size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('About')}
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <View style={{ height: height / 18, width: width / 8, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Icons name='info' size={20} ></Icons>
                        </View>
                        <Text >About Us</Text>
                        <Icons name="chevron-right"  size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text>Log Out</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

import { View, Text, Dimensions, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, ScrollView, StyleSheet, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppBar } from '@react-native-material/core';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width

export default function Reset() {
    const navigation = useNavigation();
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            padding: 35,
            paddingTop:10,
            gap: 20,
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
        },
        logo: {
            alignSelf: 'center',
            marginVertical: 10,
            top: -40,
        },
        titleContainer: {
            gap: 4,
            marginBottom: 10,
        },
        optionButton: {
            marginTop: 10,
            padding: 15,
            borderWidth: 1,
            borderColor: theme.colors.outline,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
        },
        optionIcon: {
            width: 40,
            alignItems: 'center',
        },
        optionContent: {
            flex: 1,
            marginLeft: 12,
        },
        optionTitle: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.colors.onSurface,
            marginBottom: 4,
        },
        optionDescription: {
            color: theme.colors.onSurfaceVariant,
            fontSize: 14,
        }
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <AppBar
                    color={theme.colors.background}
                    elevation={0}
                    leading={<TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Icon name="chevron-back" color={theme.colors.primary} size={30}/>
                    </TouchableOpacity>}
                />




                        <View style={styles.titleContainer}>
                            <Text style={{fontSize: 24, fontWeight: '600', color: theme.colors.onSurface}}>
                                Has olvidado tu contraseña
                            </Text>
                            <Text style={{color: theme.colors.onSurfaceVariant}}>
                                Selecciona método de recuperación de contraseña
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => navigation.navigate('ResetEmail', {type: 'email'})}>
                            <View style={styles.optionIcon}>
                                <Icon name="mail-outline" color={theme.colors.onSurfaceVariant} size={25}/>
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionTitle}>Email</Text>
                                <Text style={styles.optionDescription}>
                                  Te enviaremos el código de confirmación a tu correo electronico
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => navigation.navigate('ResetPhone', {type: 'phone'})}>
                            <View style={styles.optionIcon}>
                                <Icon name="call-outline" color={theme.colors.onSurfaceVariant} size={25}/>
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionTitle}>Teléfono</Text>
                                <Text style={styles.optionDescription}>
                                    Te enviaremos el código de confirmación a tu numero telefonico
                                </Text>
                            </View>
                        </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.backText}>Regresar</Text>
                </TouchableOpacity>
                </View>
        </SafeAreaView>
    )
}

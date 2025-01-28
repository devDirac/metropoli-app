import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { AppBar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'react-native-paper';

export default function LSuccess() {
    const theme = useTheme();
    const navigation = useNavigation();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            padding: 35,
            flex: 1,
        },
        centerContainer: {
            flex: 1,
            marginTop:-100,
            justifyContent: 'center',
            alignItems: 'center',
        },
        logo: {
            alignSelf: 'center',
            marginVertical: 32,
            top: 20,
        },
        titleContainer: {
            alignItems: 'center',
            gap: 10,
        },
        title: {
            fontSize: 24,
            fontWeight: '600',
            color: theme.colors.onSurface,
            textAlign: 'center',
        },
        subtitle: {
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            fontSize: 16,
        },
        buttonContainer: {
            marginTop: 'auto',
            marginBottom: 30,
        },
        continueButton: {
            borderRadius: 4,
            paddingVertical: 15,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
        },
        buttonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        }
    });

    const handleHomeNavigation = () => {

        try {

            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }]
            });

            setTimeout(() => {
                navigation.navigate('Home', {
                    screen: 'CreateReport'
                });
            }, 100);

        } catch (error) {
            console.error('Error navigating:', error);
        }


    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <View style={styles.content}>
                    <AppBar
                        color={theme.colors.background}
                        elevation={0}
                        leading={
                            <TouchableOpacity onPress={handleHomeNavigation}>
                                <Icon name="close" color={theme.colors.onSurface} size={30}/>
                            </TouchableOpacity>
                        }
                    />

                    <View style={styles.centerContainer}>
                        <View style={styles.logo}>
                            <Image
                                source={require('@assets/images/logos/logo.png')}
                                style={{width: 250, height: 100}}
                            />
                        </View>

                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>¡Cuenta registrada!</Text>
                            <Text style={styles.subtitle}>
                                Tu cuenta ha sido creada y verificada exitosamente
                            </Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleHomeNavigation}
                        >
                            <Text style={styles.buttonText}>Ir al inicio</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

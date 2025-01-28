import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, Alert } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Text, Button, Image } from '@components/elements';
import { useDispatch, useSelector } from 'react-redux';
import { removeSessionAuth } from '@/store/slice/authSlice';
import { getSessionUser, removeSessionUser } from "@/store/slice/userSlice";

// Colores de Google para el Avatar
const AVATAR_COLORS = [
    '#4285F4',
    '#34A853',
    '#FBBC05',
    '#EA4335',
    '#673AB7'
];

const getColorForLetter = (letter) => {
    if (!letter) return AVATAR_COLORS[0];
    const charCode = letter.toUpperCase().charCodeAt(0);
    const colorIndex = (charCode - 65) % 5;
    return AVATAR_COLORS[colorIndex];
};

const Avatar = ({ name, size = 80 }) => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : '?';
    const backgroundColor = getColorForLetter(firstLetter);

    const avatarStyles = StyleSheet.create({
        avatar: {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginVertical: 20,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
        },
        letter: {
            color: '#FFFFFF',
            fontSize: 30,
            fontWeight: '900',
            textShadowColor: 'rgba(0, 0, 0, 0.2)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 3,
            textAlign: 'center',
            includeFontPadding: false,
            textAlignVertical: 'center'
        }
    });

    return (
        <View style={avatarStyles.avatar}>
            <Text style={avatarStyles.letter}>{firstLetter}</Text>
        </View>
    );
};

export default function Account() {
    const navigation = useNavigation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const user = useSelector(getSessionUser);

    const [formData, setFormData] = useState({
        name: null,
        lastname: null,
        email: null,
        phone: null,
    });

    useEffect(() => {
        setFormData({
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
        });
    }, []);

    const handleLogout = () => {
        dispatch(removeSessionUser());
        dispatch(removeSessionAuth());
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff'
        },
        loginButton: {
            borderRadius: 4,
            paddingVertical: 4,
            elevation: 2,
            marginTop: 10,
        },
        content: {
            padding: 24
        },
        label: {
            fontSize: 14,
            fontWeight: '500',
            color: '#666',
            marginBottom: 8
        },
        input: {
            borderWidth: 1,
            borderColor: '#E0E0E0',
            borderRadius: 8,
            paddingLeft: 8,

            fontSize: 16,
            backgroundColor: '#fff',
            color: '#000',
        },

        inputContainer: {
            position: 'relative',
            marginBottom: 15
        },
        dropdownArrow: {
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: [{ translateY: -2 }],
            width: 0,
            height: 0,
            borderLeftWidth: 6,
            borderRightWidth: 6,
            borderTopWidth: 6,
            borderStyle: 'solid',
            backgroundColor: 'transparent',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: '#666',
        },
        button: {
            marginTop: 16,
            paddingVertical: 8,
            backgroundColor: '#1B4571'
        },
        logoutText: {
            color: 'red',
            textAlign: 'center',
            marginTop: 32,
            fontSize: 16
        }
    });

    return (
        <View style={styles.container}>
            <Appbar.Header elevation={0} style={{ backgroundColor: '#fff' }}>
                <Appbar.Content title="Cuenta" />
            </Appbar.Header>

            <ScrollView style={styles.content}>
                <Avatar name={formData.name} />

                <Text style={styles.label}>Nombre completo</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={formData.name}

                        placeholder="Ingresa tu nombre"
                        style={styles.input}
                        placeholderTextColor="#999"
                    />
                </View>

                <Text style={styles.label}>Correo electrónico</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={formData.email}
                        placeholder="ejemplo@correo.com"
                        keyboardType="email-address"
                        style={styles.input}
                        placeholderTextColor="#999"
                    />
                </View>

                <Text style={styles.label}>Teléfono</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={formData.phone}

                        placeholder="Tu número de teléfono"
                        keyboardType="phone-pad"
                        style={styles.input}
                        placeholderTextColor="#999"
                    />
                </View>

                <Button
                    mode="contained"
                    onPress={() => { }}
                    loading={false}
                    style={styles.loginButton}
                >
                    Guardar cambios
                </Button>

                <Button
                    mode="contained"
                    onPress={() => {
                        Alert.alert(
                            "Eliminar cuenta",
                            "¿Estás seguro que deseas eliminar tu cuenta? Este proceso iniciará un período de espera de 30 días.",
                            [
                                {
                                    text: "Cancelar",
                                    style: "cancel"
                                },
                                {
                                    text: "Sí, eliminar",
                                    onPress: () => {
                                        handleLogout();
                                        Alert.alert(
                                            "Cuenta en proceso de eliminación",
                                            "Tu cuenta entrará en proceso de eliminación y será eliminada en 30 días. Si deseas cancelar este proceso, simplemente vuelve a iniciar sesión.",
                                            [
                                                {
                                                    text: "Entendido",
                                                }
                                            ]
                                        );
                                    },
                                    style: "destructive"
                                }
                            ]
                        );
                    }}
                    loading={false}
                    style={[styles.loginButton, { backgroundColor: '#cc0000' }]}
                >
                    Eliminar cuenta
                </Button>

                <Text
                    style={styles.logoutText}
                    onPress={handleLogout}
                >
                    Cerrar sesión
                </Text>
            </ScrollView>
        </View>
    );
}

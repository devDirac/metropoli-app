import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Appbar, Avatar, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const NotificationView = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params;

    const openSocialMedia = (platform) => {
        let url = '';
        switch (platform) {
            case 'facebook':
                url = 'https://facebook.com/';
                break;
            case 'twitter':
                url = 'https://twitter.com/';
                break;
            case 'instagram':
                url = 'https://instagram.com/';
                break;
        }
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <Appbar.Header elevation={0} style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="" />
            </Appbar.Header>

            <ScrollView style={styles.content}>
                <Avatar.Image
                    size={100}
                    source={{uri:'https://www.w3schools.com/w3css/img_avatar3.png'}}
                    style={styles.avatar}
                />

                <Text style={styles.title}>¡Reporte Atendido!</Text>

                <Text style={styles.description}>
                    Estimado ciudadano,{'\n\n'}
                    Queremos informarte que tu reporte ha sido atendido.
                    Agradecemos profundamente el tiempo que invertiste
                    en compartir esta incidencia con nosotros.
                </Text>

                <Text style={styles.socialTitle}>
                    Te recomendamos a visitar nuestras redes sociales
                    para estar informado sobre otras incidencias
                </Text>

                <View style={styles.socialContainer}>
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => openSocialMedia('facebook')}
                    >
                        <Icon name="facebook" size={24} color="#4267B2" />
                        <Text style={styles.socialText}>Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => openSocialMedia('twitter')}
                    >
                        <Icon name="twitter" size={24} color="#1DA1F2" />
                        <Text style={styles.socialText}>X</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => openSocialMedia('instagram')}
                    >
                        <Icon name="instagram" size={24} color="#E1306C" />
                        <Text style={styles.socialText}>Instagram</Text>
                    </TouchableOpacity>
                </View>

                <Button

                    onPress={() => navigation.navigate('Notifications')}
                    style={styles.closeButton}
                >
                    Cerrar
                </Button>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    avatar: {
        alignSelf: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 24,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    socialTitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
        gap: 24,
    },
    socialButton: {
        alignItems: 'center',
    },
    socialText: {
        marginTop: 8,
        fontSize: 12,
        color: '#666',
    },
    closeButton: {
        marginVertical:40,
        marginHorizontal: 24,
    },
});

export default NotificationView;

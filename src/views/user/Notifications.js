import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Appbar, Surface, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const NotificationItem = ({ id, type, title, address, description, date, status, onPress }) => {
    const getIcon = () => {
        switch (status) {
            case 'atendido':
                return { name: 'check-circle', color: '#34A853' }; // Verde para atendido
            case 'no-atendido':
                return { name: 'close-circle', color: '#EA4335' }; // Rojo para no atendido
            case 'proceso':
                return { name: 'clock', color: '#FBBC05' }; // Amarillo para en proceso
            default:
                return { name: 'information', color: '#4285F4' }; // Azul por defecto
        }
    };

    const iconConfig = getIcon();

    return (
        <TouchableOpacity onPress={() => onPress(id)}>
            <Surface style={styles.notificationCard} elevation={1}>
                <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                        <View style={styles.titleContainer}>
                            <Icon
                                name={iconConfig.name}
                                size={24}
                                color={iconConfig.color}
                                style={styles.statusIcon}
                            />
                            <Text style={styles.title}>{type}</Text>
                        </View>
                        <Text style={styles.date}>{date}</Text>
                    </View>

                    <Text style={styles.description} numberOfLines={2}>
                        {description}
                    </Text>

                    <View style={styles.addressContainer}>
                        <Icon name="map-marker" size={16} color="#666" style={styles.addressIcon} />
                        <Text style={styles.address} numberOfLines={2}>{address}</Text>
                    </View>
                </View>
            </Surface>
        </TouchableOpacity>
    );
};

const NotificationScreen = () => {
    const navigation = useNavigation();
    const notifications = [
        {
            id: '1',
            type: 'Fuga de agua',
            title: 'Zócalo',
            address: 'P.za de la Constitución S/N, Centro Histórico, Cuauhtémoc, 06010 Ciudad de México',
            description: 'Queremos informarte que tu reporte ha sido atendido el día 15 de Enero.',
            date: '15 Ene 2024',
            status: 'atendido'
        },
        {
            id: '2',
            type: 'Bache',
            title: 'Condesa',
            address: 'Av. Tamaulipas 55, Condesa, Cuauhtémoc, 06140 Ciudad de México',
            description: 'Lamentamos informarte que tu reporte no pudo ser atendido debido a falta de recursos en la zona.',
            date: '14 Ene 2024',
            status: 'no-atendido'
        },
        {
            id: '3',
            type: 'Alumbrado Público',
            title: 'Roma',
            address: 'Av. Álvaro Obregón 110, Roma Norte, Cuauhtémoc, 06700 Ciudad de México',
            description: 'Tu reporte se encuentra en proceso de atención. Te mantendremos informado sobre los avances.',
            date: '13 Ene 2024',
            status: 'proceso'
        },
        {
            id: '4',
            type: 'Basura',
            title: 'Juárez',
            address: 'Av. Paseo de la Reforma 222, Juárez, Cuauhtémoc, 06600 Ciudad de México',
            description: 'Queremos informarte que tu reporte ha sido atendido el día 12 de Enero. Agradecemos tu colaboración.',
            date: '12 Ene 2024',
            status: 'atendido'
        },
        {
            id: '5',
            type: 'Bache',
            title: 'Roma Sur',
            address: 'Av. Insurgentes Sur 348, Roma Sur, Cuauhtémoc, 06760 Ciudad de México',
            description: 'Lamentamos informarte que tu reporte no pudo ser atendido. La ubicación proporcionada no corresponde a nuestra jurisdicción.',
            date: '11 Ene 2024',
            status: 'no-atendido'
        }
    ];

    const handleNotificationPress = (id) => {
        navigation.navigate('NotificationView', { id });
    };

    return (
        <View style={styles.container}>
            <Appbar.Header elevation={0} style={styles.header}>
                {Platform.OS === 'ios' ? (
                    <Appbar.BackAction
                        onPress={() => navigation.goBack()}
                        color="#007AFF"
                    />
                ) : (
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                )}
                <Appbar.Content title="Notificaciones" />
            </Appbar.Header>

            <ScrollView style={styles.content}>
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        {...notification}
                        onPress={handleNotificationPress}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        backgroundColor: '#fff'
    },
    content: {
        flex: 1,
        padding: 16,
    },
    notificationCard: {
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    notificationContent: {
        padding: 16,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIcon: {
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    addressIcon: {
        marginRight: 4,
        marginTop: 2,
    },
    address: {
        flex: 1,
        fontSize: 14,
        color: '#666',
    },
});

export default NotificationScreen;

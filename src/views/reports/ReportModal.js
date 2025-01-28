import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    Modal,
    Image,
    TextInput,
    Platform,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import {Text, Button, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import httpClient from "@/services/api";
import $endpoints from '@config/endpoints'

const StatusModal = ({visible, onClose, onSubmit, loading, eventType, setEventType, comments, setComments}) => {
    const [eventTypes, setEventTypes] = useState([]);

    useEffect(() => {
        if (visible) {
            loadEvents();
        }
    }, [visible]);

    const loadEvents = async () => {
        try {
            const response = await httpClient.get($endpoints.panel.catalogs.events, {filter:'all'}, true);
            setEventTypes(response.data.map((event) => ({
                value: event.id,
                label: event.name
            })));
        } catch (error) {
            console.error('Error loading events:', error);
        }
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.statusModalContent}>
                            <View style={styles.statusModalHeader}>
                                <Text style={styles.statusModalTitle}>Finalizar reporte</Text>

                                <TouchableOpacity onPress={onClose}>
                                    <Icon name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.statusModalBody}>
                                <View style={styles.formSection}>
                                    <Text style={styles.label}>Estado del reporte</Text>
                                    <TouchableOpacity
                                        style={styles.pickerContainer}
                                        onPress={() => {
                                            Alert.alert(
                                                "Estado del reporte",
                                                "Selecciona una opción",
                                                eventTypes.map(type => ({
                                                    text: type.label,
                                                    onPress: () => setEventType(type.value)
                                                })),
                                                {cancelable: true}
                                            );
                                        }}
                                    >
                                        <Text style={[styles.pickerText, !eventType && styles.placeholderText]}>
                                            {eventTypes.find(t => t.value === eventType)?.label || 'Selecciona un estado'}
                                        </Text>
                                        <Icon name="chevron-down" size={24} color="#1B4571"/>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.formSection}>
                                    <Text style={styles.label}>Comentarios</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Añade un comentario si lo deseas..."
                                        placeholderTextColor="#999"
                                        multiline
                                        value={comments}
                                        onChangeText={setComments}
                                        editable={!loading}
                                        returnKeyType="done"
                                        textAlignVertical="top"
                                    />
                                </View>

                                <Button
                                    mode="contained"
                                    onPress={() => onSubmit({event_id: eventType, comments})}
                                    style={styles.submitButton}
                                    loading={loading}
                                    disabled={loading}
                                >
                                    Finalizar
                                </Button>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const ReportModal = ({visible, imageUri, onClose, onSubmit, loading}) => {
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [eventType, setEventType] = useState(null);
    const [comments, setComments] = useState('');

    const handleClose = () => {
        setComments('');
        setEventType(null);
        onClose();
    };

    const handleStatusSubmit = (data) => {
        onSubmit(data);
        setStatusModalVisible(false);
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleClose}
                        style={styles.closeButton}
                        disabled={loading}
                    >
                        <Icon name="close" size={24} color="#1B4571"/>
                    </TouchableOpacity>

                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Reporte de Incidencia</Text>
                        <Text style={styles.subtitle}>
                            Verifica que la informacion sea correcta
                        </Text>
                    </View>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{uri: imageUri}}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoSection}>
                            <View style={styles.infoHeader}>
                                <Icon name="information-circle" size={20} color="#1B4571"/>
                                <Text style={styles.sectionTitle}>Información </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Incidencia:</Text>
                                <Text style={styles.infoValue}>Bache</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Fecha:</Text>
                                <Text style={styles.infoValue}>24 de Enero, 2024</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Importancia:</Text>
                                <View style={[styles.severityBadge, styles.severityHigh]}>
                                    <Text style={styles.severityText}>Alta</Text>
                                </View>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Creado por:</Text>
                                <Text style={styles.infoValue}>Juan Pérez</Text>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.infoSection}>
                            <View style={styles.infoHeader}>
                                <Icon name="location" size={20} color="#1B4571"/>
                                <Text style={styles.sectionTitle}>Ubicación</Text>
                            </View>
                            <Text style={styles.locationText}>
                                Pedro Luis Ogazón , San Ángel, Álvaro Obregón, 01000 Ciudad de México, CDMX
                            </Text>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.infoSection}>
                            <View style={styles.infoHeader}>
                                <Icon name="chatbubble" size={20} color="#1B4571"/>
                                <Text style={styles.sectionTitle}>Comentarios del usuario</Text>
                            </View>
                            <Text style={styles.commentText}>
                                Lorem ipsum es simplemente el texto de relleno de las imprentas y archivos de texto.
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={() => setStatusModalVisible(true)}
                        style={styles.finalizeButton}
                        disabled={loading}
                    >
                        Finalizar reporte
                    </Button>
                </View>

                <StatusModal
                    visible={statusModalVisible}
                    onClose={() => setStatusModalVisible(false)}
                    onSubmit={handleStatusSubmit}
                    loading={loading}
                    eventType={eventType}
                    setEventType={setEventType}
                    comments={comments}
                    setComments={setComments}
                />
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    closeButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B4571',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    imageContainer: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 5,
    },
    infoSection: {
        paddingVertical: 5,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1B4571',
        marginLeft: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        width: 100,
    },
    infoValue: {

        fontSize: 14,
        color: '#1A1A1A',
        flex: 1,
    },
    severityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    severityHigh: {
        backgroundColor: '#FFEBEE',
    },
    severityText: {
        fontSize: 12,
        color: '#D32F2F',
        fontWeight: '600',
    },
    divider: {
        marginVertical: 12,
    },
    locationText: {
        fontSize: 14,
        color: '#1A1A1A',
        lineHeight: 20,
    },
    commentText: {
        fontSize: 14,
        color: '#1A1A1A',
        lineHeight: 20,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#fff',
    },
    finalizeButton: {
        backgroundColor: '#1B4571',
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
    },
    // Estilos para el modal de estado
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 16,
    },
    statusModalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    statusModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1B4571',
    },
    statusModalBody: {
        paddingBottom: 8,
    },
    formSection: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1B4571',
        marginBottom: 8,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
    },
    pickerText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
    },
    placeholderText: {
        color: '#999',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        height: 100,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#000',
    },
    submitButton: {
        backgroundColor: '#7CB342',
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
        marginTop: 8,
    },
});

export default ReportModal;

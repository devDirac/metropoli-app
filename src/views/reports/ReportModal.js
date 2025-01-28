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
    TouchableWithoutFeedback
} from 'react-native';
import {Text, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import httpClient from "@/services/api";
import $endpoints from '@config/endpoints'

const PreviewModal = ({visible, imageUri, onClose, onSubmit, loading, onRetake,eventType,setEventType,comments,setComments}) => {
    const [eventTypes, setEventTypes] = useState([]);

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

    useEffect(() => {
        loadEvents();
    }, []);

    const handleSubmit = () => {
        onSubmit({event_id: eventType, comments});
    };

    const handleClose = () => {
        setComments('');
        setEventType(null);
        onClose();
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                            <Text style={[styles.title, { flex: 0 }]}>Vista previa</Text>
                            <Text style={styles.subtitle}>
                                Verifica que tu captura sea de buena calidad
                            </Text>
                        </View>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{uri: imageUri}}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.retakeButton}
                            onPress={onRetake}
                            disabled={loading}
                        >
                            <Icon name="camera-reverse-outline" size={20} color="#1B4571" />
                            <Text style={styles.retakeText}>Volver a tomar captura</Text>
                        </TouchableOpacity>

                        <View style={styles.form}>
                            <Text style={styles.label}>Tipo de incidencia</Text>
                            <TouchableOpacity
                                style={styles.pickerContainer}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    Alert.alert(
                                        "Tipo de incidencia",
                                        "Selecciona una opción",
                                        eventTypes.map(type => ({
                                            text: type.label,
                                            onPress: () => setEventType(type.value)
                                        })),
                                        {cancelable: true}
                                    );
                                }}
                            >
                                <Text style={styles.pickerText}>
                                    {eventTypes.find(t => t.value === eventType)?.label || 'Selecciona un tipo'}
                                </Text>
                                <Icon name="chevron-down" size={24} color="#1B4571"/>
                            </TouchableOpacity>

                            <Text style={[styles.label, {marginTop: 20}]}>Comentarios (Opcional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Describe el problema que observas"
                                placeholderTextColor="#999"
                                multiline
                                value={comments}
                                onChangeText={setComments}
                                editable={!loading}
                                returnKeyType="done"
                                blurOnSubmit={true}
                                onSubmitEditing={Keyboard.dismiss}
                                onEndEditing={() => Keyboard.dismiss()}
                                onBlur={() => Keyboard.dismiss()}
                            />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            style={styles.submitButton}
                            loading={loading}
                            disabled={loading}
                        >
                            Enviar reporte
                        </Button>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.cancelButton}
                            disabled={loading}
                        >
                            <Text style={[styles.cancelText, loading && {opacity: 0.5}]}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
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
    closeButton: {
        padding: 8,
        marginRight: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B4571',
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    imageContainer: {
        height: 220,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        marginBottom: 12,
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
    retakeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginBottom: 24,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    retakeText: {
        marginLeft: 8,
        color: '#1B4571',
        fontSize: 16,
        fontWeight: '500',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    form: {
        flex: 1,
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
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        height: 120,
        textAlignVertical: 'top',
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#000',
    },
    footer: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#7CB342',
        borderRadius: 25,
        marginBottom: 12,
        height: 50,
        justifyContent: 'center',
    },
    cancelButton: {
        alignItems: 'center',
        padding: 8,
    },
    cancelText: {
        color: '#1B4571',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default PreviewModal;

import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Platform,
    Alert,
    PermissionsAndroid,
} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import {launchCamera} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import PreviewModal from './PreviewModal';
import $endpoints from '@config/endpoints';
import httpClient from '@/services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const IS_DEMO = false;
const DEMO_IMAGE = 'https://via.placeholder.com/300';
const DEMO_LOCATION = {
    latitude: 19.4326,
    longitude: -99.1332,
    latitudeDelta: 0.0052,
    longitudeDelta: 0.0051,
};

export default function CreateReport() {
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [photoUri, setPhotoUri] = useState(null);
    const [photoBase, setPhotoBase] = useState(null);
    const [location, setLocation] = useState(IS_DEMO ? DEMO_LOCATION : null);
    const [hasLocationPermission, setHasLocationPermission] = useState(IS_DEMO);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [eventType, setEventType] = useState('');
    const [comments, setComments] = useState('');

    useEffect(() => {
        if (!IS_DEMO) {
            requestLocationPermission();
        }
    }, []);


    const handleRetakePhoto = () => {
        setShowModal(false);
        setTimeout(() => {
            takePhoto();
        }, 300);
    };

    const requestLocationPermission = async () => {
        if (IS_DEMO) {
            setHasLocationPermission(true);
            setLocation(DEMO_LOCATION);
            return;
        }

        setLoading(true);
        try {
            if (Platform.OS === 'ios') {
                Geolocation.setRNConfiguration({
                    authorizationLevel: 'whenInUse',
                    skipPermissionRequests: false,
                });

                Geolocation.requestAuthorization();
                getCurrentLocation();
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Permiso de Ubicación",
                        message: "Necesitamos tu ubicación para el reporte",
                        buttonNeutral: "Preguntar luego",
                        buttonNegative: "Cancelar",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    handleLocationPermissionDenied();
                }
            }
        } catch (err) {
            console.error('Error permisos:', err);
            handleLocationPermissionDenied();
        } finally {
            setLoading(false);
        }
    };

    const getCurrentLocation = () => {
        if (IS_DEMO) {
            setLocation(DEMO_LOCATION);
            setHasLocationPermission(true);
            return;
        }

        Geolocation.getCurrentPosition(
            position => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0052,
                    longitudeDelta: 0.0051,
                });
                setHasLocationPermission(true);
            },
            error => {
                console.error('Error ubicación:', error);
                Alert.alert(
                    "Error",
                    "No se pudo obtener tu ubicación. Verifica el GPS.",
                    [{text: "Reintentar", onPress: getCurrentLocation}]
                );
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
    };

    const handleLocationPermissionDenied = () => {
        if (IS_DEMO) {
            setHasLocationPermission(true);
            setLocation(DEMO_LOCATION);
            return;
        }

        setHasLocationPermission(false);
        Alert.alert(
            "Permiso de Ubicación",
            "Necesitamos tu ubicación para el reporte",
            [
                {text: "Cancelar", onPress: () => navigation.goBack(), style: "cancel"},
                {text: "Reintentar", onPress: requestLocationPermission}
            ]
        );
    };

    const takePhoto = async () => {
        if (!hasLocationPermission) {
            Alert.alert('Error', 'Se necesita acceso a la ubicación');
            return;
        }

        if (IS_DEMO) {
            setPhotoUri(DEMO_IMAGE);
            setShowModal(true);
            return;
        }

        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Permiso de Cámara",
                        message: "Necesitamos acceso a la cámara",
                        buttonNeutral: "Preguntar luego",
                        buttonNegative: "Cancelar",
                        buttonPositive: "OK"
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('Error', 'Se necesita permiso de la cámara');
                    return;
                }
            }

            const result = await launchCamera({
                mediaType: 'photo',
                quality: 0.8,
                maxWidth: 1280,
                maxHeight: 720,
                saveToPhotos: true,
                includeBase64: true,
            });

            if (result.didCancel) return;

            if (result.assets?.[0]?.uri) {
                setPhotoBase(result.assets[0].base64);
                setPhotoUri(result.assets[0].uri);
                setShowModal(true);
            } else {
                throw new Error('No se pudo obtener la imagen');
            }
        } catch (error) {
            console.error('Error foto:', error);
            Alert.alert("Error", "No se pudo tomar la foto");
        }
    };

    const handleSubmit = async () => {
        try {
            // Crear FormData


            const formData = new FormData();

            // Agregar la foto con el formato correcto
            if (photoUri) {
                const name = photoUri.split('/').pop(); // Obtiene el nombre del archivo de la URI
                const type = 'image/jpeg';

                formData.append('photo', {
                    uri: Platform.OS === 'ios' ? photoUri.replace('file://', '') : photoUri,
                    type: type,
                    name: name
                });
            }


            // Agregar el resto de datos
            formData.append('latitude', location.latitude);
            formData.append('longitude', location.longitude);
            formData.append('event_id', eventType);
            formData.append('comments', comments);


            const response = httpClient.post($endpoints.panel.reports, formData, false);

            const shouldShowAlert = await AsyncStorage.getItem('show_report_alert');

            if (shouldShowAlert !== 'false') {
                Alert.alert("Reporte enviado",
                    response.message,
                    [{
                        text: 'No volver a mostrar',
                        onPress: async () => {
                            await AsyncStorage.setItem('show_report_alert', 'false');
                        }
                    }, {
                        text: 'OK', onPress: () => console.log('OK Pressed')
                    }]
                );
            }

        } catch (error) {
            console.error('Error al enviar:', error);
            Alert.alert(
                "Error",
                "No se pudo enviar el reporte:" + JSON.stringify(error, 0, 2)
            );
        } finally {
            setSubmitting(false);
            setShowModal(false);
        }
    };
    const NoLocationView = () => (
        <View style={styles.noLocationContainer}>
            <Icon name="location-off" size={48} color="#666"/>
            <Text style={styles.noLocationText}>
                Necesitamos tu ubicación para crear el reporte
            </Text>
            <Button
                mode="contained"
                onPress={requestLocationPermission}
                style={styles.retryButton}
                loading={loading}
                disabled={loading}
            >
                Reintentar
            </Button>
        </View>
    );


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContainer}>
                    <View>
                        <Text style={styles.title}>Crear reporte</Text>
                        <Text style={styles.subtitle}>
                            Toma una fotografía clara de la incidencia
                        </Text>
                    </View>
                    <View style={styles.notificationContainer}>
                        <Icon name="bell-outline" size={25}/>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>5</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.mapContainer}>
                {hasLocationPermission && location ? (
                    <MapView
                        style={styles.map}
                        region={location}
                        showsUserLocation
                        followsUserLocation
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                        />
                    </MapView>
                ) : (
                    <NoLocationView/>
                )}
            </View>

            <View style={styles.bottomContainer}>
                <Button
                    mode="contained"
                    onPress={takePhoto}
                    style={styles.photoButton}
                    labelStyle={styles.buttonLabel}
                    icon="camera"
                    disabled={!hasLocationPermission}
                    loading={loading}
                >
                    Crear reporte
                </Button>
            </View>

            {IS_DEMO && (
                <View style={styles.demoIndicator}>
                    <Text style={styles.demoText}>Modo Demo</Text>
                </View>
            )}

            <PreviewModal
                visible={showModal}
                imageUri={photoUri}
                onClose={() => setShowModal(false)}
                onSubmit={() => {
                    handleSubmit()
                }}
                comments={comments}
                setComments={setComments}
                eventType={eventType}
                setEventType={setEventType}
                loading={submitting}
                onRetake={handleRetakePhoto}

            />
        </SafeAreaView>
    );
}

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
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
        }),
    },

    headerContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    notificationContainer: {
        position: "relative"
    },

    badge: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "red",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    badgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    headerTextContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1B4571',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    mapContainer: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    map: {
        flex: 1,
    },
    noLocationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    noLocationText: {
        textAlign: 'center',
        marginVertical: 20,
        color: '#666',
        fontSize: 16,
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: '#7CB342',
        marginTop: 10,
        paddingHorizontal: 24,
    },
    bottomContainer: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    },
    photoButton: {
        backgroundColor: '#7CB342',
        borderRadius: 8,
        height: 40,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    demoIndicator: {
        position: 'absolute',
        top: 75,
        right: 16,
        backgroundColor: '#FF9800',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    demoText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

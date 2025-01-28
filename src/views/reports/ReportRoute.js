import React, {useCallback, useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Linking,
    Platform,
    PermissionsAndroid,
    Alert, ScrollView
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {Badge, Button} from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Geolocation from '@react-native-community/geolocation';
import {Link} from "@react-navigation/native";

const getImportanceByType = (type) => {
    switch (type) {
        case 'Fuga de agua':
            return 'Alta';
        case 'Bache':
            return 'Media';
        case 'Alumbrado Público':
            return 'Media';
        case 'Basura':
            return 'Baja';
        default:
            return 'Media';
    }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const INITIAL_REGION = {
    latitude: 19.4237,
    longitude: -99.15435,
    latitudeDelta: 0.0351,
    longitudeDelta: 0.0550,
};


// Primero ordenamos los puntos por ID
const ROUTE_POINTS = [
    {
        id: '1',
        type: 'Fuga de agua',
        title: 'Zócalo',
        address: 'P.za de la Constitución S/N, Centro Histórico, Cuauhtémoc, 06010 Ciudad de México',
        coordinate: {
            latitude: 19.4326,
            longitude: -99.1332,
        },
        importance: 'Alta',
        distance: '0 km',
    },
    {
        id: '3',
        type: 'Bache',
        title: 'Condesa',
        address: 'Av. Tamaulipas 55, Condesa, Cuauhtémoc, 06140 Ciudad de México',
        coordinate: {
            latitude: 19.4195,
            longitude: -99.1655,
        },
        importance: 'Media',
        distance: '0.8 km'
    },
    {
        id: '2',
        type: 'Alumbrado Público',
        title: 'Roma',
        address: 'Av. Álvaro Obregón 110, Roma Norte, Cuauhtémoc, 06700 Ciudad de México',
        coordinate: {
            latitude: 19.4308,
            longitude: -99.1543,
        },
        importance: 'Media',
        distance: '0.9 km'
    },
    {
        id: '5',
        type: 'Basura',
        title: 'Juárez',
        address: 'Av. Paseo de la Reforma 222, Juárez, Cuauhtémoc, 06600 Ciudad de México',
        coordinate: {
            latitude: 19.4330,
            longitude: -99.1402,
        },
        importance: 'Baja',
        distance: '0.8 km'
    },
    {
        id: '2',
        type: 'Bache',
        title: 'Roma Sur',
        address: 'Av. Insurgentes Sur 348, Roma Sur, Cuauhtémoc, 06760 Ciudad de México',
        coordinate: {
            latitude: 19.4282,
            longitude: -99.1647,
        },
        importance: 'Media',
        distance: '0.7 km'
    },
    {
        id: '4',
        type: 'Bache',
        title: 'Roma Sur',
        address: 'Av. Insurgentes Sur 348, Roma Sur, Cuauhtémoc, 06760 Ciudad de México',
        coordinate: {
            latitude: 19.4102,
            longitude: -99.1647,
        },
        importance: 'Media',
        distance: '0.9 km'
    },
].sort((a, b) => {
    // Extraer números del id
    const idA = parseInt(a.id.replace('pt', ''));
    const idB = parseInt(b.id.replace('pt', ''));
    return idA - idB;
})
    .map((point, index, array) => {
        if (index === 0) return {...point, distance: '0 km'};
        const prevPoint = array[index - 1];
        const distance = calculateDistance(
            prevPoint.coordinate.latitude,
            prevPoint.coordinate.longitude,
            point.coordinate.latitude,
            point.coordinate.longitude
        );
        return {
            ...point,
            importance: getImportanceByType(point.type),
            distance: `${distance.toFixed(1)} km`
        };
    });

function ReportRoute() {
    const [currentLocation, setCurrentLocation] = useState(null);
    const bottomSheetRef = React.useRef(null);
    const snapPoints = React.useMemo(() => ['55%', '70%'], []);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            try {
                const granted = await Geolocation.requestAuthorization('whenInUse');
                if (granted === 'granted') {
                    getCurrentLocation();
                }
            } catch (err) {
                Alert.alert('Error', 'No se pudo obtener el permiso de ubicación');
            }
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Permiso de Ubicación',
                        message: 'La aplicación necesita acceso a tu ubicación.',
                        buttonNeutral: 'Preguntar luego',
                        buttonNegative: 'Cancelar',
                        buttonPositive: 'OK'
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                }
            } catch (err) {
                Alert.alert('Error', 'No se pudo obtener el permiso de ubicación');
            }
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                Alert.alert('Error', 'No se pudo obtener la ubicación actual');
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
    };

    useEffect(() => {
        requestLocationPermission();
        const locationInterval = setInterval(() => {
            if (Platform.OS === 'ios' || PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)) {
                getCurrentLocation();
            }
        }, 5000);

        return () => clearInterval(locationInterval);
    }, []);

    const getTotalDistance = () => {
        let total = 0;
        for (let i = 1; i < ROUTE_POINTS.length; i++) {
            const prev = ROUTE_POINTS[i - 1];
            const curr = ROUTE_POINTS[i];
            total += calculateDistance(
                prev.coordinate.latitude,
                prev.coordinate.longitude,
                curr.coordinate.latitude,
                curr.coordinate.longitude
            );
        }
        return `${total.toFixed(1)} km`;
    };

    const LocationItem = ({point, number}) => {
        const handleNavigate = () => {
            if (!currentLocation) {
                Alert.alert('Error', 'Esperando ubicación actual...');
                return;
            }
            const {coordinate, address} = point;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${coordinate.latitude},${coordinate.longitude}&travelmode=driving`;
            Linking.openURL(url).catch(err =>
                Alert.alert('Error', 'No se pudo abrir la navegación')
            );
        };

        return (
            <View style={styles.locationItem}>
                <View style={styles.leftSection}>
                    <View style={[styles.numberCircle, {
                        backgroundColor: point.importance === 'Alta' ? 'red' :
                            point.importance === 'Media' ? 'orange' : 'green'
                    }]}>
                        <Text style={styles.numberText}>{number}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.titleText}>{point.type}</Text>
                        <Link style={[styles.subtitleText,{width:'95%'}]} onPress={()=>{}}>{point.address}</Link>
                        <View style={{paddingTop:5}}>
                        <Text style={[styles.subtitleText,{fontWeight:"bold",fontSize: 12}]}>Distancia: <Text style={{fontWeight:'normal'}}>{point.distance}</Text></Text>

                            <Text style={[styles.subtitleText,{fontWeight:"bold",fontSize: 12}]}>Importancia:  <Text style={{fontWeight:'normal',
                                color: point.importance === 'Alta' ? 'red' :
                                    point.importance === 'Media' ? 'orange' : 'green'
                            }}>{point.importance}</Text></Text>

                        </View>
                    </View>
                </View>
                <Button
                    mode="contained"
                    style={[styles.initiateButton, !currentLocation && styles.initiateButtonDisabled]}
                    labelStyle={styles.buttonLabel}
                    onPress={handleNavigate}
                    disabled={!currentLocation}
                >
                    Iniciar
                </Button>
            </View>
        );
    };

    const RouteHeader = () => {
        const currentDate = new Date().toLocaleDateString('es-MX', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        return (
            <View style={styles.headerContainer}>
                <View style={styles.topSection}>
                    <View style={styles.titleWrapper}>
                        <Icon
                            name="map-marker-path"
                            size={24}
                            color="#1E88E5"
                        />
                        <Text style={styles.mainTitle}>Plan de Recorridos</Text>
                    </View>
                    <View style={styles.dateChip}>
                        <Icon
                            name="map-marker-distance"
                            size={16}
                            color="#1E88E5"
                        />
                        <Text style={styles.dateText}>{getTotalDistance()}</Text>
                    </View>
                </View>

                <View style={styles.bottomSection}>
                    <Text style={styles.fullDate}>{currentDate}</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Icon
                                name="map-marker-multiple"
                                size={16}
                                color="#757575"
                            />
                            <Text style={styles.statText}>{ROUTE_POINTS.length} paradas</Text>
                        </View>
                        <View style={styles.statDivider}/>
                        <View style={styles.statItem}>
                            <Icon
                                name="clock-outline"
                                size={16}
                                color="#757575"
                            />
                            <Text style={styles.statText}>{(ROUTE_POINTS.length * 0.5).toFixed(1)} horas aprox.</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderMarker = (point, index) => (
        <Marker
            key={point.id}
            coordinate={point.coordinate}
            title={point.title}

        >
            <View style={[
                styles.markerContainer,
                {
                    backgroundColor: point.importance === 'Alta' ? 'red' :
                        point.importance === 'Media' ? 'orange' : 'green'
                }
            ]}>
                <Text style={styles.markerText}>{index + 1}</Text>
            </View>
        </Marker>
    );

    return (
        <GestureHandlerRootView style={styles.container}>
            <View  style={{borderStyle:'solid',borderTopWidth:1, borderColor:'rgba(186,186,186,0.59)'}}>
            <MapView
                style={styles.map}
                initialRegion={INITIAL_REGION}
                showsUserLocation={true}
                showsMyLocationButton={true}
                zoomEnabled={true}
                zoomControlEnabled={true}
            >
                {ROUTE_POINTS.map((point, index) => renderMarker(point, index))}
                <Polyline
                    coordinates={ROUTE_POINTS.map(point => point.coordinate)}
                    strokeWidth={3}
                    strokeColor="#1E88E5"
                />
            </MapView>

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                handleStyle={styles.bottomSheetHandle}
                backgroundStyle={styles.bottomSheetBackground}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <RouteHeader/>

                    <ScrollView scrollEnabled={false}>
                    {ROUTE_POINTS.map((point, index) => (
                        <React.Fragment key={point.id}>
                            <LocationItem
                                point={point}
                                number={index + 1}
                            />
                            {index < ROUTE_POINTS.length - 1 && <View style={styles.itemSeparator}/>}
                        </React.Fragment>
                    ))}
                    </ScrollView>

                </BottomSheetView>
            </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    markerContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    markerText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    bottomSheetHandle: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    bottomSheetBackground: {
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    numberCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    textContainer: {
        marginLeft: 12,
        flex: 1,
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    subtitleText: {

        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    initiateButton: {
        backgroundColor: '#1E88E5',
        borderRadius: 4,
        height: 36,
        marginLeft: 8,
    },
    initiateButtonDisabled: {
        backgroundColor: '#BDBDBD',
    },
    buttonLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    itemSeparator: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 8,
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
    headerContainer: {
        marginTop: -15,
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    mainTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E88E5',
        marginRight: 12,
    },
    dateContainer: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    dateText: {
        fontSize: 14,
        color: '#1E88E5',
        fontWeight: '500',
    },
    subtitle: {
        fontSize: 15,
        color: '#757575',
        fontWeight: '400',
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dateChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    bottomSection: {
        gap: 8,
    },
    fullDate: {
        fontSize: 15,
        color: '#424242',
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 13,
        color: '#757575',
    },
    statDivider: {
        width: 1,
        height: 12,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 12,
    }
});

export default ReportRoute;

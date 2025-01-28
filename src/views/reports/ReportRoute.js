import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Text,
    Dimensions
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const INITIAL_REGION = {
    latitude: -6.2088,
    longitude: 106.8456,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const ROUTE_POINTS = [
    {
        id: '1',
        title: 'Punto 1',
        coordinate: {
            latitude: -6.2088,
            longitude: 106.8456,
        },
        distance: '0 km'
    },
    {
        id: '2',
        title: 'Punto 2',
        coordinate: {
            latitude: -6.2158,
            longitude: 106.8506,
        },
        distance: '1.2 km'
    },
    {
        id: '3',
        title: 'Punto 3',
        coordinate: {
            latitude: -6.2208,
            longitude: 106.8556,
        },
        distance: '0.8 km'
    }
];

export default function RoutePlanner() {
    const bottomSheetModalRef = React.useRef(null);
    const snapPoints = React.useMemo(() => ['25%', '50%'], []);

    React.useEffect(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const renderMarker = (point, index) => (
        <Marker
            key={point.id}
            coordinate={point.coordinate}
            title={point.title}
        >
            <View style={styles.markerContainer}>
                <Text style={styles.markerText}>{index + 1}</Text>
            </View>
        </Marker>
    );

    return (
        <BottomSheetModalProvider>
            <SafeAreaView style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={INITIAL_REGION}
                >
                    {ROUTE_POINTS.map((point, index) => renderMarker(point, index))}
                    <Polyline
                        coordinates={ROUTE_POINTS.map(point => point.coordinate)}
                        strokeWidth={3}
                        strokeColor="#2196F3"
                    />
                </MapView>

                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                >
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Puntos de la ruta</Text>
                        {ROUTE_POINTS.map((point, index) => (
                            <View key={point.id} style={styles.routeItem}>
                                <View style={styles.routeNumber}>
                                    <Text style={styles.routeNumberText}>{index + 1}</Text>
                                </View>
                                <View style={styles.routeInfo}>
                                    <Text style={styles.routeTitle}>{point.title}</Text>
                                    {index > 0 && (
                                        <Text style={styles.routeDistance}>
                                            Distancia: {point.distance}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                </BottomSheetModal>
            </SafeAreaView>
        </BottomSheetModalProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    markerContainer: {
        backgroundColor: '#2196F3',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
    },
    markerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    routeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    routeNumber: {
        width: 32,
        height: 32,
        backgroundColor: '#2196F3',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    routeNumberText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    routeInfo: {
        flex: 1,
    },
    routeTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    routeDistance: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});

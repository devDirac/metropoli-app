import React, { useState } from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity, Platform} from 'react-native';
import {IconButton, SegmentedButtons, Text} from 'react-native-paper';
import ReportRoute from './ReportRoute';
import ReportList from './ReportList';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from "@react-navigation/native";

const Reports = () => {
    const [selectedTab, setSelectedTab] = useState('list');
    const navigation = useNavigation();

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerContainer}>

               <View  >
                <Text style={styles.title}>
                    {selectedTab === 'list' ? 'Reportes' : 'Planificador'}
                </Text>
                   <Text style={styles.fullDate}> </Text>


               </View>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setSelectedTab(selectedTab === 'list' ? 'route' : 'list')}
                    >
                        <IconButton
                            icon={selectedTab === 'list' ? "map-marker-path" : "format-list-text"}
                            size={24}
                            style={styles.actionIcon}
                        />
                        <View>
                        <Text style={[styles.actionText,{marginTop:-10}]}>
                            {selectedTab === 'list' ? 'Recorrido' : 'Lista'}
                        </Text>



                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {navigation.navigate('Notifications')}}
                    >
                        <View style={styles.notificationContainer}>
                            <Icon name="bell-outline" size={24} color="#1A1A1A"/>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>5</Text>
                            </View>
                        </View>
                        <Text style={styles.actionText}>Notificaciones</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <View style={styles.contentContainer}>
                {selectedTab === 'list' ? (
                    <ReportList />
                ) : (
                    <ReportRoute />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    tabContainer: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    segmentedButtons: {
        backgroundColor: '#fff',
        borderRadius: 8,
        height: 40,
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#F5F7FA',
    },
    headerContainer: {
        paddingBottom:10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        marginTop:5

    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 72,
    },
    actionIcon: {
        margin: 0,
        marginBottom: 0,
    },
    actionText: {
        fontSize: 12,
        color: '#666666',
        marginTop: 0,
        textAlign: 'center',
    },
    notificationContainer: {
        position: 'relative',
        alignItems: 'center',
        marginTop:5,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#FF5252',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default Reports;

import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    Image
} from 'react-native';
import {
    Text,
    IconButton,
    Searchbar,
    Surface,
    Avatar,
    Portal,
    Modal
} from 'react-native-paper';
import {$theme} from "@/config/theme";
import api from '@/services/api';
import $endpoints from "@/config/endpoints";
import $system from "@/config/system";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReportModal from './ReportModal'; // Asegúrate de importar el componente

const {width} = Dimensions.get('window');

const ReportListScreen = ({navigation}) => {
    const [activeTab, setActiveTab] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const [selectedReport, setSelectedReport] = useState(null);
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [comments, setComments] = useState('');
    const [eventType, setEventType] = useState(null);

    const loadReports = async () => {
        if (!refreshing) setLoading(true);
        setError(null);
        try {
            const response = await api.get($endpoints.panel.reports, {
                filter: activeTab,
                search: searchQuery.trim()
            });

            const formattedReports = response.data?.map((report, index) => ({
                id: report.id || `temp-${index}`,
                location: report.location || "Sin ubicación",
                type: report.event?.name || "Sin tipo",
                event: report.event, // Añadimos el objeto event completo
                status: report.status?.key || "pending",
                statusIcon: <Icon name="clock" size={10}/>,
                statusName: report.status?.name || "Pendiente",
                date: report.created_at,
                severity: getSeverityFromStatus(report.status?.id),
                reportedBy: `${report.user?.name || ''} ${report.user?.lastname || ''}`.trim(),
                description: report.comments || "Sin descripción",
                photo_url: report.photo_url ? ($system.url + report.photo_url) : null,
                latitude: parseFloat(report.latitude).toFixed(5),
                longitude: parseFloat(report.longitude).toFixed(5)
            })).filter(report => {
                if (!searchQuery.trim()) return true;
                const search = searchQuery.toLowerCase().trim();
                return (
                    report.type.toLowerCase().includes(search) ||
                    report.location.toLowerCase().includes(search) ||
                    report.description.toLowerCase().includes(search) ||
                    report.reportedBy.toLowerCase().includes(search)
                );
            });

            setReports(formattedReports);
        } catch (error) {
            console.error('Error loading reports:', error);
            setError('No se pudieron cargar los reportes');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadReports();
    }, []);

    const getSeverityFromStatus = (statusId) => {
        const severityMap = {
            1: 'Baja',
            2: 'Media',
            3: 'Alta'
        };
        return severityMap[statusId] || 'Media';
    };

    useEffect(() => {
        loadReports();
    }, [activeTab]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadReports();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleReportPress = (report) => {
        setSelectedReport(report);
        setEventType(report.event?.id);
        setComments(report.description || '');
        setReportModalVisible(true);
    };

    const handleReportSubmit = async ({event_id, comments}) => {
        try {
            setLoading(true);
            const response = await api.put(`${$endpoints.panel.reports}/${selectedReport.id}`, {
                event_id,
                comments,
                status_id: selectedReport.status?.id
            });

            await loadReports();
            setReportModalVisible(false);

            // Limpiar estados
            setSelectedReport(null);
            setEventType(null);
            setComments('');
        } catch (error) {
            console.error('Error updating report:', error);
            Alert.alert(
                'Error',
                'No se pudo actualizar el reporte. Por favor, intenta nuevamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    const getTabCounts = () => {
        const statusCounts = reports.reduce((acc, report) => {
            const status = report.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return [
            {key: 'pending', label: 'Pendientes', count: statusCounts.pending || 0},
            {key: 'confirm', label: 'Atendidos', count: statusCounts.confirm || 0},
            {key: 'decline', label: 'Declinados', count: statusCounts.decline || 0}
        ];
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': '#FFB300',
            'confirm': '#4CAF50',
            'decline': '#FF5252'
        };
        return colors[status] || '#757575';
    };

    const getSeverityColor = (severity) => {
        const colors = {
            'Alta': '#FF5252',
            'Media': '#FFB300',
            'Baja': '#4CAF50'
        };
        return colors[severity] || '#757575';
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Reportes</Text>
                <View style={styles.notificationContainer}>
                    <Icon name="bell-outline" size={25}/>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>5</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderTabs = () => (
        <View style={styles.tabsContainer}>
            {getTabCounts().map(tab => (
                <TouchableOpacity
                    key={`tab-${tab.key}`}
                    onPress={() => setActiveTab(tab.key)}
                    style={[
                        styles.tab,
                        activeTab === tab.key && styles.activeTab
                    ]}>
                    <Text style={[
                        styles.tabLabel,
                        activeTab === tab.key && styles.activeTabLabel
                    ]}>
                        {tab.label}
                    </Text>
                    <View style={[
                        styles.tabBadge,
                        activeTab === tab.key && styles.activeTabBadge
                    ]}>
                        <Text style={[
                            styles.tabBadgeText,
                            activeTab === tab.key && styles.activeTabBadgeText
                        ]}>
                            {tab.count}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderContent = () => {
        if (loading && !refreshing) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={$theme?.colors?.primary}/>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={loadReports}
                    >
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (reports.length === 0) {
            return (
                <ScrollView
                    style={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[$theme?.colors?.primary]}
                            tintColor={$theme?.colors?.primary}
                        />
                    }
                >
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No hay reportes disponibles</Text>
                    </View>
                </ScrollView>
            );
        }

        return (
            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[$theme?.colors?.primary]}
                        tintColor={$theme?.colors?.primary}
                    />
                }
            >
                {reports.map((report, index) => (
                    <Surface key={`report-${report.id || index + 1}`} style={styles.card}>
                        <TouchableOpacity onPress={() => handleReportPress(report)}>
                            {report.photo_url && (
                                <View>
                                    <Image
                                        source={{uri: report.photo_url}}
                                        style={styles.cardImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.overlayFade} />
                                </View>
                            )}
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.typeContainer}>
                                        <View style={[
                                            styles.severityIndicator,
                                            {backgroundColor: getSeverityColor(report.severity)}
                                        ]}/>
                                        <Text style={styles.reportType}>{report.type}</Text>
                                    </View>
                                    <Text style={styles.date}>{report.date}</Text>
                                </View>

                                <View style={styles.locationContainer}>
                                    <IconButton
                                        icon="map-marker"
                                        size={20}
                                        iconColor={$theme.colors.primary}
                                    />
                                    <Text style={styles.location}>
                                        <Text style={{fontWeight: 'bold'}}>Latitud:</Text> {report?.latitude}
                                    </Text>
                                    <Text style={styles.location}>
                                        <Text style={{fontWeight: 'bold'}}>Longitud:</Text> {report?.longitude}
                                    </Text>
                                </View>

                                <View style={styles.commentContainer}>
                                    <View style={styles.commentHeader}>
                                        <IconButton
                                            icon="comment"
                                            size={20}
                                            iconColor={$theme.colors.primary}
                                        />
                                        <Text style={styles.commentTitle}>Comentarios:</Text>
                                    </View>
                                    <Text style={styles.commentText}>{report.description}</Text>
                                </View>

                                <View style={styles.cardFooter}>
                                    <View style={styles.reporterContainer}>
                                        <Avatar.Text
                                            size={24}
                                            label={report.reportedBy.split(' ').map(n => n[0]).join('')}
                                            style={styles.reporterAvatar}
                                        />
                                        <Text style={styles.reporterName}>{report.reportedBy}</Text>
                                    </View>
                                    <View style={styles.statusContainer}>
                                        <Text style={[
                                            styles.statusText,
                                            {color: getStatusColor(report.status)}
                                        ]}>
                                            {report.statusIcon} {report.statusName}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Surface>
                ))}
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Portal>
                <Modal
                    visible={filterVisible}
                    onDismiss={() => setFilterVisible(false)}
                    contentContainerStyle={styles.modal}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filtrar por Estado</Text>
                        {[
                            {key: 'pending', label: 'Pendientes'},
                            {key: 'confirm', label: 'Confirmados'},
                            {key: 'decline', label: 'Declinados'}
                        ].map((status) => (
                            <TouchableOpacity
                                key={status.key}
                                style={[
                                    styles.filterOption,
                                    activeTab === status.key && styles.filterOptionSelected
                                ]}
                                onPress={() => {
                                    setActiveTab(status.key);
                                    setFilterVisible(false);
                                }}
                            >
                                <Text style={[
                                    styles.filterOptionText,
                                    activeTab === status.key && styles.filterOptionTextSelected
                                ]}>
                                    {status.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Modal>
            </Portal>

            {renderHeader()}
            <View style={styles.searchContainer}>
                <View style={styles.searchBarContainer}>
                    <Searchbar
                        placeholder="Buscar reportes..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                        right={(props) => (
                            <IconButton
                                {...props}
                                icon="filter-variant"
                                onPress={() => setFilterVisible(true)}
                            />
                        )}
                    />
                </View>
            </View>
            {renderTabs()}
            {renderContent()}

            {/* Añadimos el ReportModal */}
            <ReportModal
                visible={reportModalVisible}
                imageUri={selectedReport?.photo_url}
                onClose={() => {
                    setReportModalVisible(false);
                    setSelectedReport(null);
                    setEventType(null);
                    setComments('');
                }}
                onSubmit={handleReportSubmit}
                loading={loading}
                eventType={eventType}
                setEventType={setEventType}
                comments={comments}
                setComments={setComments}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    errorText: {
        color: '#FF5252',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: $theme?.colors?.primary
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    },
    emptyContainer: {
        flex: 1,
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        color: '#666',
        fontSize: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchBar: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 30,
        marginBottom: 16,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 15,
        backgroundColor: '#fff',
        marginRight: 10,
        elevation: 2,
    },
    activeTab: {
        backgroundColor: $theme?.colors?.primary,
    },
    tabLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    activeTabLabel: {
        color: '#fff',
    },
    tabBadge: {
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 8,
    },
    activeTabBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    tabBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    activeTabBadgeText: {
        color: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    card: {
        borderRadius: 16,
        backgroundColor: '#fff',
        marginBottom: 16,
        elevation: 2,
        overflow: 'hidden'
    },

    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    severityIndicator: {
        width: 4,
        height: 16,
        borderRadius: 2,
        marginRight: 8,
    },
    reportType: {
        marginRight:5,
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    commentContainer: {
        marginVertical: 0,
        marginBottom: 10,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: -10,
    },
    commentTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    commentText: {
        fontSize: 14,
        color: '#666',
        marginTop: -20,
        paddingLeft: 50,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    reporterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reporterAvatar: {
        backgroundColor: '#E0E0E0',
    },
    reporterName: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'capitalize'
    },
    modal: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 16,
        padding: 20,
    },
    modalContent: {
        width: '100%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1A1A1A',
    },
    filterOption: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#f5f5f5',
    },
    filterOptionSelected: {
        backgroundColor: $theme?.colors?.primary,
    },
    filterOptionText: {
        fontSize: 16,
        color: '#666',
    },
    filterOptionTextSelected: {
        color: '#fff',
    },

    cardImage: {
        width: '100%',
        height: 200,
        position: 'relative' // Importante para el posicionamiento del overlay
    },

    overlayFade: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        opacity: 0.25,
    },

});

export default ReportListScreen;

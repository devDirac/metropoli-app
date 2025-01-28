import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

class CameraHandler {
    constructor() {
        this.cameraOptions = {
            mediaType: 'photo',
            quality: 0.8,
            maxWidth: 1280,
            maxHeight: 720,
            saveToPhotos: true,
            includeBase64: false,
            cameraType: 'back',
            presentationStyle: 'fullScreen',
            includeExtra: true,
            compressImageQuality: 0.8,
            compressImageMaxWidth: 1280,
            compressImageMaxHeight: 720,
            formatAsMp4: false,
            rotation: 0,
            videoQuality: 'high',
            durationLimit: 0,
            useFrontCamera: false,
            cropperActiveWidgetColor: null,
            cropperStatusBarColor: null,
            cropperToolbarColor: null,
            cropperToolbarWidgetColor: null
        };

        this.temporaryFiles = new Set();
    }

    async checkAndRequestPermissions() {
        try {
            if (Platform.OS === 'ios') {
                const cameraStatus = await check(PERMISSIONS.IOS.CAMERA);
                const photoLibraryStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
                const photoLibraryAddStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);

                let permissionsToRequest = [];

                if (cameraStatus !== RESULTS.GRANTED) {
                    permissionsToRequest.push(PERMISSIONS.IOS.CAMERA);
                }
                if (photoLibraryStatus !== RESULTS.GRANTED) {
                    permissionsToRequest.push(PERMISSIONS.IOS.PHOTO_LIBRARY);
                }
                if (photoLibraryAddStatus !== RESULTS.GRANTED) {
                    permissionsToRequest.push(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
                }

                if (permissionsToRequest.length > 0) {
                    const results = await Promise.all(
                        permissionsToRequest.map(permission => request(permission))
                    );

                    const allGranted = results.every(result => result === RESULTS.GRANTED);

                    if (!allGranted) {
                        Alert.alert(
                            'Permisos Requeridos',
                            'Para usar la cámara y guardar fotos, necesitamos acceso a la cámara y la galería.',
                            [
                                { text: 'Ir a Configuración', onPress: () => Linking.openSettings() },
                                { text: 'Cancelar', style: 'cancel' }
                            ]
                        );
                        return false;
                    }
                    return true;
                }

                return true;
            } else {
                const androidPermissions = [
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                ];

                const results = await PermissionsAndroid.requestMultiple(androidPermissions);

                const allGranted = Object.values(results).every(
                    result => result === PermissionsAndroid.RESULTS.GRANTED
                );

                if (!allGranted) {
                    Alert.alert(
                        'Permisos Requeridos',
                        'Para usar la cámara y guardar fotos, necesitamos los permisos solicitados.',
                        [
                            { text: 'Ir a Configuración', onPress: () => Linking.openSettings() },
                            { text: 'Cancelar', style: 'cancel' }
                        ]
                    );
                    return false;
                }

                return true;
            }
        } catch (error) {
            console.error('Error checking permissions:', error);
            return false;
        }
    }

    async handleImageCapture() {
        try {
            const hasPermissions = await this.checkAndRequestPermissions();

            if (!hasPermissions) {
                throw new Error('PERMISSION_DENIED');
            }

            const result = await launchCamera(this.cameraOptions);
            console.log('Camera result:', result);

            if (result.didCancel) {
                console.log('User cancelled camera');
                throw new Error('USER_CANCELLED');
            }

            if (result.errorCode) {
                console.error('Camera error:', result.errorMessage);
                throw new Error(result.errorCode);
            }

            if (!result.assets || !result.assets[0]) {
                console.error('No image captured');
                throw new Error('NO_IMAGE_CAPTURED');
            }

            const asset = result.assets[0];

            // Validar la imagen capturada
            if (!asset.uri || !asset.type || !asset.fileName) {
                console.error('Invalid image data:', asset);
                throw new Error('INVALID_IMAGE_DATA');
            }

            // Verificar el tamaño y dimensiones
            if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) { // 10MB máximo
                throw new Error('IMAGE_TOO_LARGE');
            }

            // Agregar el archivo a la lista de temporales
            this.temporaryFiles.add(asset.uri);

            return {
                uri: asset.uri,
                type: asset.type,
                name: asset.fileName,
                width: asset.width,
                height: asset.height,
                fileSize: asset.fileSize,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error in handleImageCapture:', error);
            let errorMessage = 'No se pudo capturar la imagen';

            switch (error.message) {
                case 'PERMISSION_DENIED':
                    errorMessage = 'Se requieren permisos de cámara para continuar';
                    break;
                case 'USER_CANCELLED':
                    return null; // Usuario canceló, no mostrar error
                case 'NO_IMAGE_CAPTURED':
                    errorMessage = 'No se pudo capturar la imagen';
                    break;
                case 'INVALID_IMAGE_DATA':
                    errorMessage = 'La imagen capturada no es válida';
                    break;
                case 'IMAGE_TOO_LARGE':
                    errorMessage = 'La imagen es demasiado grande (máximo 10MB)';
                    break;
                default:
                    errorMessage = `Error: ${error.message}`;
            }

            throw new Error(errorMessage);
        }
    }

    // Método para limpiar archivos temporales
    async cleanup() {
        try {
            for (const fileUri of this.temporaryFiles) {
                try {
                    if (Platform.OS === 'ios') {
                        await RNFS.unlink(fileUri);
                    } else {
                        // En Android, los archivos se limpian automáticamente
                        continue;
                    }
                } catch (error) {
                    console.warn(`Failed to delete temporary file: ${fileUri}`, error);
                }
            }
            this.temporaryFiles.clear();
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }

    // Método para validar una imagen
    validateImage(imageData) {
        if (!imageData) {
            throw new Error('No se proporcionaron datos de imagen');
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/heic'];
        if (!validTypes.includes(imageData.type)) {
            throw new Error('Formato de imagen no soportado');
        }

        if (imageData.fileSize > 10 * 1024 * 1024) {
            throw new Error('La imagen es demasiado grande (máximo 10MB)');
        }

        return true;
    }
}

export default new CameraHandler();

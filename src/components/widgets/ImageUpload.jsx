import React, { useState } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    Platform,
    PermissionsAndroid
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import PropTypes from 'prop-types';

const ImageUpload = ({
                         maxFileSize = 5, // en MB
                         onSuccess,
                         onError,
                         defaultImage,
                         size = 150,
                         endpoint = '/api/upload',
                         mode = 'default' // 'default' o 'avatar'
                     }) => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const requestPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    {
                        title: "Permiso para acceder a la galería",
                        message: "Necesitamos acceder a tu galería para seleccionar imágenes",
                        buttonNeutral: "Pregúntame después",
                        buttonNegative: "Cancelar",
                        buttonPositive: "OK"
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const validateImage = (fileSize) => {
        if (fileSize > maxFileSize * 1024 * 1024) {
            throw new Error(`La imagen debe ser menor a ${maxFileSize}MB`);
        }
    };

    const uploadImage = async (imageUri) => {
        const formData = new FormData();

        // Crear el objeto del archivo para el FormData
        const fileType = imageUri.substring(imageUri.lastIndexOf(".") + 1);
        formData.append('file', {
            uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
            name: `photo.${fileType}`,
            type: `image/${fileType}`
        });

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = await response.json();
            return result;
        } catch (error) {
            throw error;
        }
    };

    const pickImage = async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
            onError?.(new Error('Permiso denegado para acceder a la galería'));
            return;
        }

        const options = {
            mediaType: 'photo',
            quality: 1,
            includeBase64: false,
            maxWidth: 1024,
            maxHeight: 1024,
        };

        try {
            const result = await launchImageLibrary(options);

            if (result.didCancel) {
                return;
            }

            if (result.errorCode) {
                throw new Error(result.errorMessage);
            }

            const selectedImage = result.assets[0];

            try {
                validateImage(selectedImage.fileSize);
                setImage(selectedImage.uri);
                setUploading(true);

                const uploadResult = await uploadImage(selectedImage.uri);
                onSuccess?.(uploadResult);
            } catch (error) {
                onError?.(error);
                alert(error.message);
            } finally {
                setUploading(false);
            }
        } catch (error) {
            onError?.(error);
            alert('Error al seleccionar la imagen');
        }
    };

    const renderAvatar = () => (
        <TouchableOpacity
            onPress={pickImage}
            style={[styles.avatarContainer, { width: size, height: size }]}
        >
            <Image
                source={image ? { uri: image } : defaultImage ? { uri: defaultImage } : require('./placeholder.png')}
                style={[styles.avatarImage, { width: size, height: size }]}
            />
            {uploading && (
                <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            )}
        </TouchableOpacity>
    );

    const renderDefault = () => (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Toca para seleccionar una imagen</Text>
                    </View>
                )}
                {uploading && (
                    <View style={styles.uploadingOverlay}>
                        <ActivityIndicator size="large" color="#ffffff" />
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );

    return mode === 'avatar' ? renderAvatar() : renderDefault();
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadButton: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        color: '#666',
        fontSize: 16,
    },
    uploadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarContainer: {
        borderRadius: 75,
        overflow: 'hidden',
    },
    avatarImage: {
        borderRadius: 75,
        resizeMode: 'cover',
    },
});

ImageUpload.propTypes = {
    maxFileSize: PropTypes.number,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    defaultImage: PropTypes.string,
    size: PropTypes.number,
    endpoint: PropTypes.string,
    mode: PropTypes.oneOf(['default', 'avatar'])
};

export default ImageUpload;

/**
 * Name: Service API
 * Description: Servicio para realizar peticiones mediante axios en React Native
 * Path: services/api.js
 * Last Update: 12/11/2024
 */

import axios from 'axios';
import { Alert } from 'react-native';
import { store } from '@/store';
import { removeSessionAuth } from '@/store/slice/authSlice';
import  $system  from '@config/system';

const api = axios.create({
    baseURL: $system.url,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para agregar el token
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Función para manejar errores
const handleError = (error, showAlert = true) => {
    let errorMessage = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
    let validationErrors = null;

    if (error.response) {
        const { status, data } = error.response;

        switch (status) {
            case 401:
                errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
                store.dispatch(removeSessionAuth());
                // Aquí deberías manejar la navegación usando navigation.reset()
                break;
            case 403:
                errorMessage = 'No tienes permisos para realizar esta acción.';
                break;
            case 404:
                errorMessage = 'El recurso solicitado no existe.';
                break;
            case 422:
                errorMessage = data.message || 'Los datos proporcionados no son válidos.';
                if (data.errors) {
                    validationErrors = data.errors;
                    if (showAlert) {
                        const errorList = Object.values(data.errors)
                            .flat()
                            .join('\n• ');

                        Alert.alert(
                            'Error de validación',
                            `• ${errorList}`,
                            [{ text: 'Entendido' }],
                            { cancelable: true }
                        );
                    }
                }
                break;
            case 500:
                errorMessage = 'Error interno del servidor. Por favor, inténtalo más tarde.';
                break;
            default:
                errorMessage = data.message || 'Ha ocurrido un error inesperado.';
        }
    } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }

    // Mostrar alerta si no hay errores de validación y showAlert es true
    if (showAlert && !validationErrors) {
        Alert.alert(
            'Error',
            errorMessage,
            [{ text: 'Entendido' }],
            { cancelable: true }
        );
    }

    return Promise.reject({
        message: errorMessage,
        errors: validationErrors,
        originalError: error
    });
};

// Métodos HTTP principales
const httpClient = {
    async get(endpoint, params = {}, showAlert = true) {
        try {
            const response = await api.get(endpoint, { params });
            return response.data;
        } catch (error) {
            return handleError(error, showAlert);
        }
    },

    async post(endpoint, data = {}, showAlert = true, headers = {}) {
        try {
            const response = await api.post(endpoint, data, { headers });
            if (showAlert && response.data.message) {
                Alert.alert(
                    'Éxito',
                    response.data.message,
                    [{ text: 'Aceptar' }],
                    { cancelable: true }
                );
            }
            return response.data;
        } catch (error) {
            return handleError(error, showAlert);
        }
    },

    async put(endpoint, data = {}, showAlert = true) {
        try {
            const response = await api.put(endpoint, data);
            if (showAlert && response.data.message) {
                Alert.alert(
                    'Éxito',
                    response.data.message,
                    [{ text: 'Aceptar' }],
                    { cancelable: true }
                );
            }
            return response.data;
        } catch (error) {
            return handleError(error, showAlert);
        }
    },

    async delete(endpoint, showAlert = true) {
        try {
            const response = await api.delete(endpoint);
            if (showAlert && response.data.message) {
                Alert.alert(
                    'Éxito',
                    response.data.message,
                    [{ text: 'Aceptar' }],
                    { cancelable: true }
                );
            }
            return response.data;
        } catch (error) {
            return handleError(error, showAlert);
        }
    }
};

export default httpClient;

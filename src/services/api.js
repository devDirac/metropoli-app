import axios from 'axios';
import {Alert} from 'react-native';
import {store} from '@/store';
import {removeSessionAuth} from '@/store/slice/authSlice';
import $system from '@config/system';

const api = axios.create({
    baseURL: $system.url,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

api.interceptors.request.use(
  (config) => {
      const state = store.getState();
      const token = state.auth.token;
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers.agentFrom = 'mobile';
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

const handleError = (error, showAlert = true) => {
    let errorMessage = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
    let validationErrors = null;

    if (error.response) {
        const {status, data} = error.response;

        switch (status) {
            case 401:
                errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
                store.dispatch(removeSessionAuth());
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
                    errorMessage = Object.values(data.errors)
                      .flat()
                      .join('\n• ');
                }
                break;
            case 500:
                errorMessage = data.message + '\n Error interno del servidor. Por favor, inténtalo más tarde.';
                break;
            default:
                errorMessage = data.message || 'Ha ocurrido un error inesperado.';
        }
    } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }

    if ((showAlert === true || showAlert === 'error') && !validationErrors) {
        Alert.alert(
          'Error',
          errorMessage,
          [{text: 'Entendido'}],
          {cancelable: true}
        );
    }

    return Promise.reject({
        message: errorMessage,
        errors: validationErrors,
        originalError: error
    });
};

const httpClient = {
    async get(endpoint, params = {}, showAlert = true) {
        try {
            const response = await api.get(endpoint, {params});
            return response.data;
        } catch (error) {
            return handleError(error, showAlert);
        }
    },

    async post(endpoint, params = {}, showAlert = true, headers = {}) {
        try {
            const response = await api.post(endpoint, params, {headers});

            if ((showAlert === true || showAlert === 'success') && response.data.message) {
                Alert.alert(
                  'Éxito',
                  response.data.message,
                  [{text: 'Aceptar'}],
                  {cancelable: true}
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
            if ((showAlert === true || showAlert === 'success') && response.data.message) {
                Alert.alert(
                  'Éxito',
                  response.data.message,
                  [{text: 'Aceptar'}],
                  {cancelable: true}
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
            if ((showAlert === true || showAlert === 'success') && response.data.message) {
                Alert.alert(
                  'Éxito',
                  response.data.message,
                  [{text: 'Aceptar'}],
                  {cancelable: true}
                );
            }
            return response.data;
        } catch (error) {
            return handleError(error, showAlert);
        }
    }
};

export default httpClient;

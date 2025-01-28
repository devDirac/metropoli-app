import {
  View,
  SafeAreaView,
  Dimensions,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Appbar, TextInput, TouchableRipple, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/Feather';
import api from "@/services/api";
import { useDispatch } from "react-redux";
import $endpoints from '@config/endpoints';
import Toast from 'react-native-toast-message';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

export default function NewPassword() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const route = useRoute();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = route.params;

  const [formData, setFormData] = useState({
    code: params?.code || '',
    token: params?.token || '',
    email: params?.email || '',
    phone: params?.phone || '',
    type: params?.type || '',
    password: '',
    password_confirmation: ''
  });

  const handleChangeForm = useCallback((name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    setError(null);
  }, []);

  const checkPasswordStrength = useCallback((password) => {
    if (!password) return { strength: '', criteria: {} };

    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const metCriteria = Object.values(criteria).filter(Boolean).length;

    let strength = '';
    if (metCriteria >= 5) {
      strength = 'strong';
    } else if (metCriteria >= 3) {
      strength = 'medium';
    } else {
      strength = 'weak';
    }

    return { strength, criteria };
  }, []);

  const validateForm = () => {
    if (!formData.password) {
      setError('La contraseña es requerida');
      return false;
    }
    if (formData.password !== formData.password_confirmation) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    const { strength } = checkPasswordStrength(formData.password);
    if (strength === 'weak') {
      setError('La contraseña es demasiado débil');
      return false;
    }
    return true;
  };



  const PasswordRequirements = () => {
    return (
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Icon name="circle" size={8} color="#666" style={{ marginRight: 8 }} />
          <Text style={{ color: '#666' }}>Mínimo 8 caracteres</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Icon name="circle" size={8} color="#666" style={{ marginRight: 8 }} />
          <Text style={{ color: '#666' }}>Al menos una letra mayúscula</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Icon name="circle" size={8} color="#666" style={{ marginRight: 8 }} />
          <Text style={{ color: '#666' }}>Al menos una letra minúscula</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Icon name="circle" size={8} color="#666" style={{ marginRight: 8 }} />
          <Text style={{ color: '#666' }}>Al menos un número</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Icon name="circle" size={8} color="#666" style={{ marginRight: 8 }} />
          <Text style={{ color: '#666' }}>Al menos un carácter especial (!@#$%^&*)</Text>
        </View>
      </View>
    );
  };

  const updatePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        phone: formData.phone,
        code: formData.code,
        email: formData.email,
        type: formData.type,
        password: formData.password
      };

      const response = await api.post($endpoints.auth.reset_password, dataToSend,'error');
      console.log(JSON.stringify(response,0,2));
      Alert.alert(
        'Cuenta restablecida',
        response.message,
        [{text: 'Entendido'}],
      );
      navigation.navigate('Login');

    } catch (err) {
      setError(err?.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const { strength, criteria } = checkPasswordStrength(formData.password);

  const getStrengthColor = (strength) => {
    switch(strength) {
      case 'strong': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'weak': return '#f44336';
      default: return '#e0e0e0';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        </Appbar.Header>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
              <Icon name="lock-closed" size={32} color={theme.colors.primary} />
              <Text style={styles.title}>Crear nueva contraseña</Text>
              <Text style={styles.subtitle}>
                Asegúrate de crear una contraseña segura
              </Text>
            </View>



            <View style={styles.inputContainer}>
              <TextInput
                label="Nueva contraseña"
                value={formData.password}
                secureTextEntry={!isPasswordVisible}
                right={
                  <TextInput.Icon
                    icon={isPasswordVisible ? 'eye-off' : 'eye'}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                }
                left={<TextInput.Icon icon="lock" />}
                onChangeText={(text) => handleChangeForm('password', text)}
                mode="outlined"
                style={styles.input}
              />

              <View style={styles.strengthContainer}>
                {Object.entries(criteria).map(([key, met]) => (
                  <View key={key} style={styles.criteriaItem}>
                    <Icons
                      name={met ? "check" : "circle"}
                      size={16}
                      color={met ? '#4CAF50' : '#9e9e9e'}
                    />
                    <Text style={[styles.criteriaText, { color: met ? '#4CAF50' : '#9e9e9e' }]}>
                      {key === 'length' ? 'Mínimo 8 caracteres' :
                        key === 'uppercase' ? 'Mayúscula' :
                          key === 'lowercase' ? 'Minúscula' :
                            key === 'number' ? 'Número' : 'Caracter especial'}
                    </Text>
                  </View>
                ))}
              </View>

              <TextInput
                label="Confirmar contraseña"
                value={formData.password_confirmation}
                secureTextEntry={!isPasswordVisible1}
                right={
                  <TextInput.Icon
                    icon={isPasswordVisible1 ? 'eye-off' : 'eye'}
                    onPress={() => setIsPasswordVisible1(!isPasswordVisible1)}
                  />
                }
                left={<TextInput.Icon icon="lock" />}
                onChangeText={(text) => {
                  handleChangeForm('password_confirmation', text);
                  setPasswordsMatch(formData.password === text);
                }}
                mode="outlined"
                error={!passwordsMatch && formData.password_confirmation !== ''}
                style={styles.input}
              />
            </View>


            <TouchableRipple
              onPress={updatePassword}
              disabled={loading || !passwordsMatch}
              style={[
                styles.button,
                {
                  backgroundColor:  theme.colors.primary,

                }
              ]}
            >




              <View style={styles.buttonContent}>
                {loading && (
                  <ActivityIndicator color="#fff" style={styles.buttonLoader} />
                )}
                <Text style={styles.buttonText}>
                  {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                </Text>
              </View>
            </TouchableRipple>





          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:-30,
    backgroundColor: '#fff',
  },
  header: {
    elevation: 0,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    color: '#f44336',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  strengthContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  criteriaText: {
    marginLeft: 8,
    fontSize: 14,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 24,
  },
  buttonLoader: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

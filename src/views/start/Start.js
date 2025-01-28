import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground,
    StatusBar,
    FlatList,
    TextInput, ActivityIndicator
} from 'react-native'
import React, {useState, useContext, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@theme/color'
import themeContext from '@theme/themeContex'
import style from '@theme/style'
import {Select} from "@components/Forms";
import api from "@/services/api";
import {setSessionCompany} from "../../store/slice/companySlice";
import {useDispatch} from "react-redux";

import {$routes,$config} from '@config/Routes'
import Toast from "react-native-toast-message";
import {removeSessionCompany} from "@app/store/slice/companySlice";
import Icons from "react-native-vector-icons/Feather";
import {OneSignal} from "react-native-onesignal";
import {setSessionAuth} from "@/store/slice/authSlice";
import {setSessionUser} from "@/store/slice/userSlice";


const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width

export default function Start() {
    const navigation = useNavigation();
    const theme = useContext(themeContext);
    const dispatch = useDispatch();

    const [companies, setCompanies] = useState([]);
    const [selectCompany, setSelectCompany] = useState(null);

    const [formAuth, setFormAuth] = useState({email:null,password:null});
    const [loading, setLoading] = useState(false);

    const [isPasswordVisible, setIsPasswordVisible] = useState(true)
    const [isFocused, setIsFocused] = useState(false)


    const handleChangeForm = (name, value) => {
        setFormAuth(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    function onSubmit() {
        try {

            setLoading(true);
            api.postAwaiting('auth/login', formAuth).then(response => {

                if (response.data.token !== undefined && response.data.token !== '') {
                    // setToken Authentication



                    OneSignal.login(response.data.auth.code);

                    // Get permission user
                    //    api.postAwaiting('auth/permissions', {}).then(response => {
                    Toast.show({
                        type: 'success', // 'success', 'error', 'info', 'warning'
                        position: 'top',
                        text1: '¡Acceso correcto!',
                        text2: 'Accediendo',
                        visibilityTime:2500,
                        onHide: () => {

                            dispatch(setSessionAuth({token: response.data.token, lang: 'es'}));
                            dispatch(setSessionUser({
                                name: response.data.auth.name,
                                email: response.data.auth.email,
                                company: response.data.auth.company.name,
                                image_profile: response.data.auth.image_profile
                            }));

                            dispatch(
                                setSessionCompany({
                                    name: response.data.auth.company.name || null,
                                    code: response.data.auth.company.code || null,
                                    phone: response.data.auth.company.phone || null,
                                    company_type_id: response.data.auth.company.company_type_id || null,
                                    facebook_url: response.data.auth.company.facebook_url || null,
                                    email_support: response.data.auth.company.email_support || null,
                                    contact_sales_method: response.data.auth.company.contact_sales_method || null,

                                })
                            );
                            setLoading(false);

                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'MyTabs' }],
                            });
                        }
                        // });
                    });
                }
            }).catch(error=>{
                setLoading(false);

            })
        } catch (e) {

            setLoading(false);

            //    Notification.errorMessage(error.message.title, error.message.description);

        }

    }

    const getCompanies = async () => {
        try {
            const response = await api.postAwaiting($routes.company.public, {
                filter: 'all',
            });

            setCompanies(response.data.map(item => ({
                ...item,
                label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
                value: item.code,
            })));
        } catch (error) {
            console.error('Error al obtener :', error);
        }
    };


    const handleSelectCompany= (code)=>{
         const company = companies.find(item =>item.code==code);
         setSelectCompany(company);
    }

    const continueProcess = (withProvider=true) => {
        if (withProvider &&selectCompany === null) {
            Toast.show({
                type: 'warning',
                position: 'top',
                text1: 'Selecciona un proveedor',
                text2: 'No has seleccionado ningún proveedor',
            });
            return;
        }

        if(!withProvider){
            const company = companies.find(item =>item.code=='dee643b7352cc588bdfa8c75319d6c96c5081ed4786baf4a7b');

            dispatch(
                setSessionCompany({
                    name: company.name || null,
                    code: company.code || null,
                    phone: company.phone || null,
                    company_type_id: company.company_type_id || null,
                    facebook_url: company.facebook_url || null,
                    email_support: company.email_support || null,
                    contact_sales_method: company.contact_sales_method || null,

                })
            );
        }else{
            dispatch(
                setSessionCompany({
                    name: selectCompany.name || null,
                    code: selectCompany.code || null,
                    phone: selectCompany.phone || null,
                    company_type_id: selectCompany.company_type_id || null,
                    facebook_url: selectCompany.facebook_url || null,
                    email_support: selectCompany.email_support || null,
                    contact_sales_method: selectCompany.contact_sales_method || null,

                })
            );
        }


        navigation.navigate('Login');
    };
    useEffect(()=>{
        getCompanies();
    },[]);

    return (
        <SafeAreaView style={[style.area, { backgroundColor: theme.bg }]}>
            <View style={{ position: 'relative' }}>
                <ImageBackground
                    source={require('../../assets/image/login/bg_2.png')}
                    style={{ height: height / 3.5, width: width }}
                />

            </View>

            <View style={{ backgroundColor: theme.bg, marginHorizontal: 20 }}>


                <View style={{alignContent:'center', alignItems:'center'}}>
                <Text style={[style.title, { color: theme.txt,}]}>Bienvenido </Text>
                <Text style={[style.m14, { color: Colors.disable,}]}>Ingresa tu cuenta para iniciar sesión</Text>
                </View>

                <View style={[style.inputContainer, { marginTop: 15, borderColor: isFocused === 'Email' ? Colors.primary : theme.border,  }]}>
                    <TextInput placeholder='Correo electrónico'
                               value={formAuth.email}
                               keyboardType="email-address"
                               onChangeText={(value) => handleChangeForm('email', value)}
                               onFocus={() => setIsFocused('Email')}
                               onBlur={() => setIsFocused(false)}
                               placeholderTextColor={Colors.disable}
                               style={[style.r14, { paddingHorizontal: 10, color: theme.txt, flex: 1 }]}
                    />
                </View>

                <View style={[style.inputContainer, { borderColor: isFocused === 'Password' ? Colors.primary : theme.border,marginTop:15 }]}>
                    <TextInput placeholder='Contraseña'

                               onChangeText={(value) => handleChangeForm('password', value)}
                               secureTextEntry={isPasswordVisible}
                               value={formAuth.password}

                               onFocus={() => setIsFocused('Password')}
                               onBlur={() => setIsFocused(false)}
                               selectionColor={Colors.primary}
                               placeholderTextColor={Colors.disable}
                               style={[style.r14, { paddingHorizontal: 10, color: theme.txt, flex: 1 }]}
                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} >
                        <Icons name={isPasswordVisible ? 'eye-off' : 'eye'} color={isFocused === 'Password' ? Colors.primary : Colors.disable} size={20} />
                    </TouchableOpacity>
                </View>



                <View style={{marginTop:15}}>
                    <TouchableOpacity disabled={loading} onPress={() =>onSubmit()}
                                      style={[style.btn,{ flexDirection: 'row', alignItems: 'center' ,      justifyContent: 'center'}]}>
                        {loading && <ActivityIndicator size="small" color="white" style={{ marginRight: 5}} />}
                        <Text style={style.btntxt}>  Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ paddingTop:5,flexDirection: 'row', alignItems: 'center', alignContent:'center',alignSelf:'center' }}>
                    <Text style={[style.m14, { color: Colors.primary }]}>¿Olvidas tu contraseña?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
                        <Text style={[style.m14, { color: Colors.primary, fontWeight: 'bold', marginLeft: 10 }]}>Recuperar</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginVertical: 15 }}>
                    <View style={[style.divider, { flex: 1, backgroundColor: theme.border }]}></View>
                    <Text style={[style.m14, { color: Colors.disable, marginHorizontal: 10, }]}>o continua con</Text>
                    <View style={[style.divider, { flex: 1, backgroundColor: theme.border }]}></View>
                </View>



                <View style={{marginTop:0}}>
                    <TouchableOpacity disabled={loading} onPress={() =>onSubmit()} style={[style.btn_grey,{ flexDirection: 'row', alignItems: 'center' ,      justifyContent: 'center'}]}>
                        {loading && <ActivityIndicator size="small" color="white" style={{ marginRight: 5}} />}

                        <Image source={require('../../assets/image/Google.png')} style={{width: 20,height:20}}/>
                        <Text> Google</Text>

                    </TouchableOpacity>
                </View>



                <View style={{marginTop:5}}>
                    <TouchableOpacity disabled={loading} onPress={() =>onSubmit()} style={[style.btn_grey,{ flexDirection: 'row', alignItems: 'center' ,      justifyContent: 'center'}]}>
                        {loading && <ActivityIndicator size="small" color="white" style={{ marginRight: 5}} />}
                        <Image source={require('../../assets/image/facebook.png')} style={{width: 20,height:20}}/>
                        <Text>  Facebook</Text>

                    </TouchableOpacity>
                </View>



                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 10, marginBottom: 5 }}>
                    <Text style={[style.m14, { color: Colors.disable }]}>¿Auton no tienes cuenta?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={[style.b14, { color: Colors.primary }]}> Registrate</Text>
                    </TouchableOpacity>
                </View>


                <View style={{ alignItems:'center', alignContent:'center', justifyContent: 'center', paddingTop: 10, marginBottom: 10 }}>
                    <Text style={[style.m14, { color: Colors.disable }]}>Al continuar, aceptas nuestros </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={[style.b14, { color: Colors.primary }]}> Terminos de Servicio and Políticas de Privacidad</Text>

                    </TouchableOpacity>

                    <Image source={require('../../assets/image/sanpedro.png')} style={{width: 120,height:50}}/>

                </View>



            </View>
        </SafeAreaView>
    )
}

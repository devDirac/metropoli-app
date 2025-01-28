import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import {store} from '@/store';
import {Provider as PaperProvider} from 'react-native-paper';
import DrawerNavigation from '@/navigator/DrawerNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {$theme} from '@/config/theme';
const App = () => {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={$theme} >
                <Provider store={store}>
                    <NavigationContainer>
                        <DrawerNavigation/>
                    </NavigationContainer>
                </Provider>
            </PaperProvider>
            <Toast />
        </SafeAreaProvider>
    );
};

export default App;

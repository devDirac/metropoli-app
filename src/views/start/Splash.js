import { View, Text, SafeAreaView, StatusBar, Dimensions, Image } from 'react-native'
import React, {  useContext } from 'react'



const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Splash() {
    return (
        <SafeAreaView >
            <StatusBar backgroundColor="transparent" translucent={true} />
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Reporte Ciudadano</Text>
                    <Text>Reporta incidentes rapidamente</Text>
                </View>

            </View>
        </SafeAreaView>
    )
}

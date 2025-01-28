import {View, Text,Dimensions,TouchableOpacity,SafeAreaView, FlatList} from 'react-native'
import React, { useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native';

import IntroItem from './IntroItem';

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width
const Slides =[
    {
        id:1,
        title1: 'Seguimiento en tiempo real',
        subtitle: 'Rastrea la ubicación de tus dispositivos en tiempo real, estés donde estés.',
        img:require('../../assets/image/introduction/realtime.png'),
    },
    {
        id:2,
        title1: '',
        subtitle: '',
        img:require('../../assets/image/introduction/playback.png'),
    },

    {
        id:3,
        title1: '',
        subtitle: '',
        img:require('../../assets/image/introduction/geozone.png'),
    },

    {
        id:4,
        title1: ' ',
        subtitle: '',
        img:require('../../assets/image/introduction/commands.png'),
    },

];
export default function Introduction() {
    const navigation = useNavigation();
    const ref = React.useRef(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const Footer = () => {
        return <View >

            <Text style={{alignSelf:'center',paddingBottom:10}}>{currentSlideIndex+1} | {Slides.length}</Text>

            <View style={{
                flexDirection: 'row', alignSelf: 'center'
            }}>
                {Slides.map((_, index) =>
                (
                    <View key={index}

                    />
                ))}
            </View>

            <View>

                {currentSlideIndex+1 === Slides.length ? (

                    <View style={{ paddingVertical: 20 }}>
                        <TouchableOpacity onPress={()=>navigation.navigate('Start')}
                        >
                            <Text >Empezar</Text>
                        </TouchableOpacity>
                    </View>


                ): (
                    <View style={{ paddingVertical: 20 }}>
                        <TouchableOpacity onPress={goNextSlide}
                        >
                            <Text >Continuar</Text>
                        </TouchableOpacity>
                    </View>
                ) }
            </View>
        </View>
    }

    const updateCurrentSlideIndex = (e) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);
    };

    const goNextSlide = () => {
        const nextSlideIndex = currentSlideIndex + 1;
        if (nextSlideIndex != Slides.length) {
            const offset = nextSlideIndex * width;
            ref?.current?.scrollToOffset({ offset });
            setCurrentSlideIndex(nextSlideIndex);
        }

    };
    return (
        <SafeAreaView >
            <FlatList data={Slides}
                ref={ref}
                renderItem={({ item }) => <IntroItem item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={updateCurrentSlideIndex}
            />
            <Footer />
        </SafeAreaView>
    )
}

// components/Image.jsx
import React from 'react';
import { Image as RNImage, StyleSheet, Platform } from 'react-native';

const Image = ({
                   source,
                   style,
                   resizeMode = 'contain',
                   ...props
               }) => {
    const styles = StyleSheet.create({
        image: {
            width: '100%',
            height: '100%',
        },
        shadow: Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            }
        })
    });

    return (
        <RNImage
            source={source}
            style={[styles.image, style]}
            resizeMode={resizeMode}
            {...props}
        />
    );
};

Image.resizeMode = RNImage.resizeMode;
Image.getSize = RNImage.getSize;
Image.getSizeWithHeaders = RNImage.getSizeWithHeaders;
Image.prefetch = RNImage.prefetch;
Image.abortPrefetch = RNImage.abortPrefetch;
Image.queryCache = RNImage.queryCache;
Image.resolveAssetSource = RNImage.resolveAssetSource;

export default Image;

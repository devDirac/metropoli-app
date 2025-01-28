import React from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator as PaperActivityIndicator, useTheme } from 'react-native-paper';

const ActivityIndicator = ({
    size = 'small',
    style,
    ...props
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        indicator: {
            margin: 8,
        }
    });

    return (
        <PaperActivityIndicator
            size={size}
            style={[styles.indicator, style]}
            {...props}
        />
    );
};

export default ActivityIndicator;

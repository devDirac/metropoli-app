import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB as PaperFAB, useTheme } from 'react-native-paper';

const FAB = ({
    style,
    ...props
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
        }
    });

    return (
        <PaperFAB
            style={[styles.fab, style]}
            {...props}
        />
    );
};

export default FAB;

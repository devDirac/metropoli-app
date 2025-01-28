import React from 'react';
import { StyleSheet } from 'react-native';
import { Snackbar as PaperSnackbar, useTheme } from 'react-native-paper';

const Snackbar = ({
    style,
    ...props
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        snackbar: {
            borderRadius: 4,
        }
    });

    return (
        <PaperSnackbar
            style={[styles.snackbar, style]}
            {...props}
        />
    );
};

export default Snackbar;

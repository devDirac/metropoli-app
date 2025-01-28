import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton as PaperIconButton, useTheme } from 'react-native-paper';

const IconButton = ({
    mode = 'contained',
    size = 24,
    style,
    ...props
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        button: {
            margin: 4,
        },
        contained: {
            backgroundColor: theme.colors.primary,
        },
        outlined: {
            borderWidth: 1,
            borderColor: theme.colors.primary,
        }
    });

    return (
        <PaperIconButton
            mode={mode}
            size={size}
            style={[
                styles.button,
                mode === 'contained' ? styles.contained : styles.outlined,
                style
            ]}
            {...props}
        />
    );
};

export default IconButton;

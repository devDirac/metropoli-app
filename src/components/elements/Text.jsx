import React from 'react';
import { StyleSheet } from 'react-native';
import { Text as PaperText, useTheme } from 'react-native-paper';

const Text = ({
    variant = 'bodyMedium',
    style,
    children,
    ...props
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        text: {
            color: theme.colors.onSurface,
        }
    });

    return (
        <PaperText
            variant={variant}
            style={[styles.text, style]}
            {...props}
        >
            {children}
        </PaperText>
    );
};

export default Text;

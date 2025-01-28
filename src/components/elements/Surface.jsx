import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface as PaperSurface, useTheme } from 'react-native-paper';

const Surface = ({
    style,
    children,
    ...props
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        surface: {
            backgroundColor: theme.colors.surface,
            borderRadius: 4,
        }
    });

    return (
        <PaperSurface
            style={[styles.surface, style]}
            {...props}
        >
            {children}
        </PaperSurface>
    );
};

export default Surface;

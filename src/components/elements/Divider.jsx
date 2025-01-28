import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider as PaperDivider, useTheme } from 'react-native-paper';

const Divider = ({
    style,
    ...props
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        divider: {
            backgroundColor: theme.colors.outlineVariant,
        }
    });

    return (
        <PaperDivider
            style={[styles.divider, style]}
            {...props}
        />
    );
};

export default Divider;

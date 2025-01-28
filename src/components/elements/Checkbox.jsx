import React from 'react';
import { StyleSheet } from 'react-native';
import { Checkbox as PaperCheckbox, useTheme } from 'react-native-paper';

const Checkbox = ({
    status = 'unchecked',
    style,
    ...props
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        checkbox: {
            margin: 4,
        }
    });

    return (
        <PaperCheckbox
            status={status}
            style={[styles.checkbox, style]}
            {...props}
        />
    );
};

export default Checkbox;

import React from 'react';
import { StyleSheet } from 'react-native';
import { Modal as PaperModal, useTheme } from 'react-native-paper';

const Modal = ({
    visible,
    onDismiss,
    style,
    contentStyle,
    children,
    ...props
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        modal: {
            borderRadius: 12,
            backgroundColor: theme.colors.surface,
            margin: 20,
        },
        content: {
            padding: 20,
        }
    });

    return (
        <PaperModal
            visible={visible}
            onDismiss={onDismiss}
            style={[styles.modal, style]}
            contentContainerStyle={[styles.content, contentStyle]}
            {...props}
        >
            {children}
        </PaperModal>
    );
};

export default Modal;

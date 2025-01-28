import React from 'react';
import { StyleSheet } from 'react-native';
import { Menu as PaperMenu, useTheme } from 'react-native-paper';

const Menu = ({
    visible,
    onDismiss,
    anchor,
    style,
    contentStyle,
    children,
    ...props
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        menu: {
            borderRadius: 4,
        },
        content: {
            backgroundColor: theme.colors.surface,
        }
    });

    return (
        <PaperMenu
            visible={visible}
            onDismiss={onDismiss}
            anchor={anchor}
            style={[styles.menu, style]}
            contentStyle={[styles.content, contentStyle]}
            {...props}
        >
            {children}
        </PaperMenu>
    );
};

export default Menu;

import React from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard, useTheme } from 'react-native-paper';

const Card = ({
    style,
    contentStyle,
    children,
    ...props
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        card: {
            borderRadius: 12,
            elevation: 2,
        },
        content: {
            padding: 16,
        }
    });

    return (
        <PaperCard
            style={[styles.card, style]}
            contentStyle={[styles.content, contentStyle]}
            {...props}
        >
            {children}
        </PaperCard>
    );
};

export default Card;

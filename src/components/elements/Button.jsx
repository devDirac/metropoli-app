import React from 'react';
import { StyleSheet, Platform, ActivityIndicator, View } from 'react-native';
import { Button as PaperButton, useTheme } from 'react-native-paper';

const Button = ({
                    mode = 'text',
                    onPress,
                    style,
                    labelStyle,
                    contentStyle,
                    children,
                    loading = false,
                    spinnerColor,
                    ...props
                }) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        button: {
            borderRadius: 4,
        },
        contained: {
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                },
                android: {
                    elevation: 2,
                }
            })
        },
        outlined: {
            borderWidth: 1,
        },
        content: {
            paddingHorizontal: 5,
            flexDirection: 'row',
            alignItems: 'center',
        },
        label: {
            fontSize: 17,
            fontWeight: 'bold',
        },
        spinnerContainer: {
            marginRight: 8,
        }
    });

    const getStylesByMode = () => {
        switch (mode) {
            case 'contained':
                return styles.contained;
            case 'outlined':
                return styles.outlined;
            default:
                return styles.text;
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.content}>
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator
                            size="small"
                            color={spinnerColor || theme.colors.primary}
                        />
                    </View>
                    {children}
                </View>
            );
        }
        return children;
    };

    return (
        <PaperButton
            mode={mode}
            onPress={onPress}
            style={[styles.button, getStylesByMode(), style]}
            labelStyle={[styles.label, labelStyle]}
            contentStyle={[styles.content, contentStyle]}
            elevated={mode === 'contained'}
            disabled={loading}
            {...props}
        >
            {renderContent()}
        </PaperButton>
    );
};

export default Button;

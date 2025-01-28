import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput as PaperTextInput, useTheme } from 'react-native-paper';

const TextInput = ({
                       mode = 'flat',
                       style,
                       outlineStyle,
                       underlineStyle,
                       theme: propTheme,
                       ...props
                   }) => {
    const theme = propTheme || useTheme();

    const styles = StyleSheet.create({
        input: {
            backgroundColor: 'transparent',
            fontSize: 16,
            height: 40,
        },
        flat: {
            paddingTop: 5,
            backgroundColor: 'transparent',
            paddingHorizontal: 0,
        },
        outlined: {
            backgroundColor: 'transparent',
            borderRadius: 4,
        }
    });

    return (
        <PaperTextInput
            mode={mode}
            style={[
                styles.input,
                mode === 'outlined' ? styles.outlined : styles.flat,
                style,
            ]}
            outlineStyle={outlineStyle}
            underlineStyle={underlineStyle}
            underlineColor={theme.colors.outline}
            activeUnderlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.onSurface}
            dense={true}
            theme={theme}
            {...props}
        />
    );
};

TextInput.Icon = PaperTextInput.Icon;
TextInput.Affix = PaperTextInput.Affix;

export default TextInput;

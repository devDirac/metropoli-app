// config/theme.js
import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';

export const colors = {
    primary: {
        0: '#000000',
        10: '#00105C',
        20: '#001D85',
        30: '#002DB0',
        40: '#1B3B89',
        50: '#1855FF',
        60: '#4570FF',
        70: '#658AFF',
        80: '#85A5FF',
        90: '#A6C0FF',
        95: '#B8CFFF',
        99: '#FAFBFF',
        100: '#FFFFFF',
    },
    secondary: {
        0: '#000000',
        10: '#001B3D',
        20: '#003062',
        30: '#00468A',
        40: '#005DB3',
        50: '#0076DD',
        60: '#3990F6',
        70: '#5BABFF',
        80: '#7FC6FF',
        90: '#A6E0FF',
        95: '#CFECFF',
        99: '#F9FCFF',
        100: '#FFFFFF',
    },
    neutral: {
        0: '#000000',
        10: '#1C1B1F',
        20: '#313033',
        30: '#484649',
        40: '#605D62',
        50: '#787579',
        60: '#939094',
        70: '#AEAAAE',
        80: '#C9C5CA',
        90: '#E6E1E5',
        95: '#F4EFF4',
        99: '#FFFBFF',
        100: '#FFFFFF',
    },
    neutralVariant: {
        0: '#000000',
        10: '#1D1A22',
        20: '#322F37',
        30: '#49454F',
        40: '#605D66',
        50: '#79747E',
        60: '#938F99',
        70: '#AEA9B4',
        80: '#CAC4D0',
        90: '#E7E0EC',
        95: '#F5EEFA',
        99: '#FFFBFF',
        100: '#FFFFFF',
    }
};

const customLightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#084D6E',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        onSurface: '#1C1B1F',
        onSurfaceVariant: '#49454F',
        outline: '#79747E',
        outlineVariant: '#CAC4D0',

    },
};

export const paperComponents = {
    Button: {
        contained: {
            backgroundColor: '#1B3B89',
            borderRadius: 4,
            paddingVertical: 8,
            paddingHorizontal: 16,
            elevation:2
        },
        outlined: {
            borderColor: '#1B3B89',
            borderRadius: 4,
            paddingVertical: 8,
            paddingHorizontal: 16,
        },
        text: {
            color: '#1B3B89',
        },
    },
    TextInput: {
        flat: {
            backgroundColor: 'transparent',
            underlineColor: '#CAC4D0',
        },
    },
};

export const $theme = {
    ...customLightTheme,
    components:paperComponents,
};

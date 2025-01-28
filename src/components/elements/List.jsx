// src/components/List.jsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { List as PaperList, useTheme } from 'react-native-paper';

const ListItem = ({ style, ...props }) => {
    const theme = useTheme();
    const styles = StyleSheet.create({
        item: {
            paddingVertical: 8,
        }
    });
    return <PaperList.Item style={[styles.item, style]} {...props} />;
};

const ListSection = ({ style, ...props }) => {
    const theme = useTheme();
    const styles = StyleSheet.create({
        section: {
            paddingHorizontal: 16,
        }
    });
    return <PaperList.Section style={[styles.section, style]} {...props} />;
};

const List = {
    Item: ListItem,
    Section: ListSection
};

export default List;

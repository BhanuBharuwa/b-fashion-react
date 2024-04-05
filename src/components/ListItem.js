import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

const ListItem = ({ title, value, isLast }) => {
    return (
        <View style={[styles.activity_item, isLast && { marginBottom: 80 }]}>
            <View style={styles.vendor}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.checkbox}>
                <Text style={{ textAlign: "right" }}>{value}</Text>
            </View>
        </View>
    )
}

export default ListItem

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        color: '#333'
    },
    activity_item: {
        flexDirection: "row",
        paddingBottom: 10,
        marginVertical: 6,
        alignItems: "center",
        justifyContent: "space-between"
    },
    vendor: {
        marginHorizontal: 10,
        flex: 1,
        width: "45%"
    },
    checkbox: {
        marginHorizontal: 10,
        width: "55%"
    }
})
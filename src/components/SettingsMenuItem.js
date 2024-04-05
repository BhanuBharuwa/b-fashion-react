import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'

import Divider from './Divider'

const SettingsMenuItem = ({ title, iconName, screen }) => {
    const navigation = useNavigation()
    return (
        <>
            <TouchableOpacity
                onPress={() => { navigation.navigate(screen) }} >
                <View style={styles.menu_item}>
                    <Icon style={styles.icon} name={iconName} size={22} color="#000" />
                    <Text style={styles.title}>{title}</Text>
                </View>
            </TouchableOpacity>
            <Divider />
        </>
    )
}

export default SettingsMenuItem

const styles = StyleSheet.create({
    menu_item: {
        flexDirection: "row",
        padding: 10,
        marginVertical: 6,
        alignItems: "center"
    },

    icon: {
        marginStart: 10,
        marginEnd: 20,
        opacity: 0.6
    },

    title: {
        fontSize: 18
    }
})
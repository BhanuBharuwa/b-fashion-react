import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../constants/theme'

const OpenDrawerButton = ({ navigation }) => {
    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity
                onPress={() => {
                    navigation.openDrawer()
                }}>
                <Icon name="menu" color={theme.primaryColorDark} size={24} />
            </TouchableOpacity>
        </View>
    )
}

export default OpenDrawerButton

const styles = StyleSheet.create({
    mainContainer: {
        padding: 4,
        marginHorizontal: 12
    }
})
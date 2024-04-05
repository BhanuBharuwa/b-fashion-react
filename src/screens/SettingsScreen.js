import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MenuItem from '../components/SettingsMenuItem'

const SettingsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.menu}>
                <MenuItem title={"App Health"} iconName={"heart"} screen={"AppHealthScreen"} />
                <MenuItem title={"Contact Us"} iconName={"phone"} screen={"ContactUsScreen"} />
                <MenuItem title={"Change Password"} iconName={"lock"} screen={"ChangePasswordScreen"} />
            </View>
        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})

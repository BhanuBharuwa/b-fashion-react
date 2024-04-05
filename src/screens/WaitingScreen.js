import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import { theme } from '../constants/theme'
import Icon from 'react-native-vector-icons/Ionicons'

const WaitingScreen = ({ navigation, }) => {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <SafeAreaView style={{ flex: 0, backgroundColor: theme.primaryColor }} />
            <SafeAreaView style={[styles.container, { backgroundColor: theme.primaryColor }]}>
                <View style={styles.inner_container}>
                    <Icon name="warning" size={110} color="#334" />
                    <Text
                        style={{
                            marginHorizontal: 5,
                            fontSize: 22,
                            color: theme.primaryColorDark,
                            marginVertical: 10
                        }}>Pending Device Verification</Text>
                    <Text
                        style={{
                            marginHorizontal: 5,
                            fontSize: 16,
                            textAlign: "center",
                            paddingHorizontal: 20
                        }}>Please contact your company to activate your device.</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { navigation.goBack() }}>
                        <Text style={{ color: 'white', fontSize: 16 }}> Go Back </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#fff' }} />
        </View>
    )
}

export default WaitingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    inner_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    button: {
        backgroundColor: theme.primaryColorDark,
        paddingVertical: 15,
        width: "60%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },

    buttons_row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    button_text: {
        fontSize: 16,
        color: theme.primaryColorDark,
        textDecorationLine: 'underline'
    }
})
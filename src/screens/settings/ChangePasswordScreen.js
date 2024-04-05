import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'

import { theme } from '../../constants/theme'

const ChangePasswordScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.input_container}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput style={styles.input_text} keyboardType="email-address" placeholder="E-mail" value="manish@bharuwasolutions.com" />
            </View>
            <View style={styles.input_container}>
                <Text style={styles.label}>Old Password</Text>
                <TextInput style={styles.input_text} secureTextEntry={true} placeholder="Old Password" value="oldpwd" />
            </View>
            <View style={styles.input_container}>
                <Text style={styles.label}>New Password</Text>
                <TextInput style={styles.input_text} secureTextEntry={true} placeholder="New Password" value="bhandina" />
            </View>
            <View style={styles.input_container}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput style={styles.input_text} secureTextEntry={true} placeholder="Confirm Password" value="bhandina" />
            </View>

            <TouchableOpacity
                style={styles.button_container}
                onPress={() => { }} >
                <View style={styles.button}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 }}>SUBMIT</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default ChangePasswordScreen

const styles = StyleSheet.create({
    container: {
        padding: 16,

    },

    label: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold"
    },

    input_text: {
        borderColor: theme.primaryColorDark,
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 16,
        paddingHorizontal: 10,
        marginTop: 5,
        height: Platform.OS === 'ios' ? 30 : null,

    },

    input_container: {
        marginBottom: 10,
    },

    button_container: {
        backgroundColor: theme.primaryColorDark,
        paddingVertical: 10,
        width: "60%",
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20
    },
})
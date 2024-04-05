import React from 'react'
import { SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

import { Avatar, Surface } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'

import { theme } from '../constants/theme'

const screenHeight = Dimensions.get('window').height
const ProfileScreen = ({ navigation }) => {
    const headerTitle = () => {
        return (
            <View style={{
                flexDirection: 'row',
                backgroundColor: theme.primaryColor,
                paddingHorizontal: 15,
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='arrow-back' color='white' size={25} />
                </TouchableOpacity>
                <Text style={{
                    fontSize: 20,
                    color: '#FFF',
                    letterSpacing: 1.5,
                    marginStart: 20
                }}>
                    PROFILE
                </Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {headerTitle()}
            <ScrollView
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: theme.primaryColor
                }} >
                <View style={styles.profileWrapper}>
                    <View style={{
                        height: 80,
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}>
                        <Avatar.Image
                            backgroundColor={'white'}
                            source={require('../assets/images/profile.png')}
                            size={120}
                            style={{
                                top: -70,
                                borderWidth: 7,
                                borderColor: theme.primaryColor
                            }}
                        />
                        <View style={{ flexDirection: 'row', height: 40, alignItems: 'center', top: -40 }}>
                            <Text style={{ fontSize: 16 }}>Availability: </Text>
                            <Icon name='checkmark-circle' color='green' size={30} />
                        </View>
                    </View>
                    <Surface style={styles.surface}>
                        <Text>Name</Text>
                        <Text>Email</Text>
                        <Text>Employee Code</Text>
                    </Surface>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    profileWrapper: {
        height: screenHeight * 0.75,
        backgroundColor: '#fff',
        borderTopEndRadius: 30
    },

    surface: {
        marginHorizontal: 25,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    }
})

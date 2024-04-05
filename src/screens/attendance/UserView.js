import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { Avatar, Text } from 'react-native-paper'
import { colors } from '../../constants/theme'

const UserView = ({name}) => {
  return (
    <View style={styles.helloUserContainer}>
          <View style={styles.helloUser}>
            <Text style={styles.helloUserText}>
              Hello, {name?.toUpperCase() ?? ''}
            </Text>
            <Text
              style={[styles.helloUserText, {fontSize: 16, fontWeight: '400'}]}>
              You are welcome
            </Text>
          </View>
          <Avatar.Image
            source={require('../../assets/images/profile.png')}
            backgroundColor={'white'}
            size={60}
          />
        </View>
  )
}

export default UserView

const styles = StyleSheet.create({
    helloUserContainer: {
        height: '10%',
        backgroundColor: colors.primaryColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 16,
      },

      helloUser: {
        padding: 16,
      },
    
      helloUserText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500',
      },
})

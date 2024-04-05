import React from 'react'
import { View, Text } from 'react-native'
import { theme } from '../constants/theme'

const HeaderTitle = ({ title }) => {
    return (
        <View>
            <Text style={{
                fontSize: 20,
                color: theme.primaryColorDark,
                letterSpacing: 1.5
            }}>
                {title.toUpperCase()}
            </Text>
        </View>
    )
}

export default HeaderTitle

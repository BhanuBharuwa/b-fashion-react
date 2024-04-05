import * as React from 'react';
import { View } from 'react-native-animatable';
import { Modal, Text, Portal, Provider, ActivityIndicator, Colors } from 'react-native-paper';
import theme from '../constants/theme';

const containerStyle = {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 30,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 10
};

const LoadingScreen = ({ visible, text }) => {
    return (
        <Modal
            animationType="fade"
            transparent={false}
            visible={visible}
            dismissable={false}
            contentContainerStyle={containerStyle}>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator animating={true} color="#00B0F7" />
                <Text style={{ marginStart: 20, fontSize: 16 }}>{text}</Text>
            </View>
        </Modal>
    )
}

export default LoadingScreen

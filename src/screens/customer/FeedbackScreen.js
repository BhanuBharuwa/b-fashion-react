import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Modal } from 'react-native-paper'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Snackbar from 'react-native-snackbar'
import { Picker } from '@react-native-picker/picker'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { RNCamera } from 'react-native-camera';

import { urls } from '../../constants/urls'
import { theme } from '../../constants/theme'

const containerStyle = {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    marginHorizontal: 20,
    borderRadius: 20
};

const PendingView = () => (
    <View
        style={{
            flex: 1,
            backgroundColor: 'lightgreen',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Text>Waiting</Text>
    </View>
);

const FeedbackScreen = ({ visibility, feedbackOptions }) => {
    const [selectedFeedback, setSelectedFeedback] = useState('none')
    const [uri, setUri] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [cameraVisible, setCameraVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isPhotoRequired, setIsPhotoRequired] = useState(false)

    useEffect(() => {
        setIsVisible(visibility)
    }, [visibility])

    function feedbackValidation() {
        if (selectedFeedback === 'none') {
            Snackbar.show({
                text: 'Please choose one of the feedback!'
            })
            return false
        }

        if (isPhotoRequired) {
            if (uri === '') {
                Snackbar.show({
                    text: 'Please take a photo'
                })
                return false
            }
        }
        return true
    }

    const sendFeedback = async () => {
        if (feedbackValidation()) {
            setIsLoading(true)
            // try {
            //     const token = await AsyncStorage.getItem('token')
            //     const company = await AsyncStorage.getItem('url');
            //     const response = await axios({
            //         url: urls.prefix + company + urls.saveFeedback,
            //         method: 'POST',
            //         headers: {
            //             'x-auth': token,
            //             'version': '1',
            //             'Content-type': 'application/json'
            //         },
            //         data: {
            //             feedback_id: "order-taken"
            //         }
            //     })

            //     if (response.data.success === true) {
            //         Snackbar.show({
            //             text: 'Feedback submitted',
            //             duration: Snackbar.LENGTH_SHORT
            //         })
            //         setIsVisible(false)
            //         setIsLoading(false)
            //     } else {
            //         setIsVisible(false)
            //         setIsLoading(false)
            //     }
            // } catch (error) {
            //     setIsVisible(false)
            //     setIsLoading(false)
            //     Alert.alert('Error', error)
            // }
        }
    }
    const openCamera = () => {
        return (
            <View style={styles.container}>
                <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}>
                    {({ camera, status }) => {
                        if (status !== 'READY') return <PendingView />;
                        return (
                            <View style={{ width: '100%', position: 'absolute', bottom: 20, flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => takePicture(camera)} style={styles.capture}>
                                    <Icon name='camera' size={45} color="black" style={{ backgroundColor: "gray", padding: 10, borderRadius: 20 }} />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                </RNCamera>
            </View>
        );
    }

    const takePicture = async (camera) => {
        const options = { quality: 0.5, base64: true };
        const data = await camera.takePictureAsync(options);
        setUri(data.uri)
        setCameraVisible(false)
    };


    useEffect(() => {
        checkPhotoRequirement()
    }, [selectedFeedback])

    const handleFeedback = (value) => {
        setSelectedFeedback(value)

        feedbackOptions.map(e => {
            if (e._id === value) {
                setIsPhotoRequired(e.is_photo_required)
            }
        })
    }

    const checkPhotoRequirement = () => {
        if (!isPhotoRequired) {
            setUri('')
        }
    }

    return (
        <Modal animationType="fade"
            transparent={false}
            visible={isVisible}>
            {cameraVisible !== true ?
                <View style={{
                    backgroundColor: 'white',
                    alignItems: 'center',
                    paddingVertical: 30,
                    marginHorizontal: 20,
                    borderRadius: 20
                }}>
                    <View style={styles.input_container}>
                        <Text style={styles.label}>Please provide a feedback</Text>
                        <Picker
                            selectedValue={selectedFeedback}
                            style={{ height: 50 }}
                            onValueChange={(itemValue) => handleFeedback(itemValue)}>

                            <Picker.Item label={'Choose one'} value={'none'} />
                            {feedbackOptions.map((e, key) => {
                                return <Picker.Item key={key} label={e.text} value={e._id} />
                            })}
                        </Picker>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-around',
                            width: "100%"
                        }}>
                            {isPhotoRequired ? (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: theme.primaryColor,
                                        padding: 5, height: 40, borderRadius: 10
                                    }}
                                    onPress={() => setCameraVisible(true)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name='camera' size={30} color='white' />
                                        <Text style={{ color: 'white' }}>Take Photo</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : null}
                            {uri === '' ? null : (
                                <View>
                                    <Image source={{ uri }} style={{ width: 100, height: 100 }} />
                                    <View>
                                        <Text>Latitude: {location.latitude}</Text>
                                        <Text>Longitude: {location.longitude}</Text>
                                        <Text>{moment().format('h:mm A - YYYY/MM/DD')}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.button_container}
                        onPress={() => {
                            sendFeedback()
                        }}>
                        {isLoading ? (
                            <ActivityIndicator animating={true} size={18} color={'white'} />
                        ) : (
                                <Text
                                    style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                        letterSpacing: 1
                                    }}>SUBMIT</Text>
                            )}

                    </TouchableOpacity>
                </View>
                : openCamera()}
        </Modal>
    )
}

export default FeedbackScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    label: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 20
    },

    input_container: {
        marginBottom: 10,
        width: "90%"
    },

    preview: {
        flex: 1
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
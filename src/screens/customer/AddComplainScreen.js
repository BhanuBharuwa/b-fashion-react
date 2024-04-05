import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, Button, TextInput} from 'react-native-paper';

import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {launchCamera} from 'react-native-image-picker';
import {theme} from '../../constants/theme';
import {urls} from '../../constants/urls';
import {askCameraPermission} from '../../utils/camera_permission';

const AddComplainScreen = ({route, navigation}) => {
  const {id} = route.params;
  const [complainTypes, setComplainTypes] = useState([]);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedComplainTypes, setSelectedComplainTypes] = useState('none');
  const [selectedComplainFeedbackTypes, setSelectedComplainFeedbackTypes] =
    useState('none');
  const [complainFeedbackTypes, setComplainFeedbackTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uri, setUri] = useState('');

  useEffect(() => {
    getComplainType();
    getComplainFeedbackType();
  }, []);

  const onHandleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const datas = new FormData();
      datas.append('customer_id', id);
      datas.append('complaint_type_id', selectedComplainTypes);
      datas.append('message', message);
      if (uri) {
        datas.append('photo', {
          uri: uri,
          type: 'image/jpeg',
          name: 'avatar',
        });
      }
      const response = await axios({
        method: 'POST',
        url: urls.prefix + company + urls.complaints,
        headers: {
          version: '1',
          'x-auth': token,
          'Content-type': 'multipart/form-data',
        },
        data: datas,
      });
      const {data} = response;
      if (data.success) {
        navigation.goBack();
        alert('Complain has successfully added');
      } else {
        const {errors} = data;
        if (errors.customer_id) {
          alert(errors.customer_id);
        }
        if (errors.complaint_type_id) {
          alert(errors.complaint_type_id);
        }
        if (errors.message) {
          alert(errors.message);
        }
        if (errors.complaint_feedback_type_id) {
          alert(errors.complaint_feedback_type_id);
        }
        if (errors.feedback) {
          alert(errors.feedback);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const getComplainType = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        method: 'GET',
        url: urls.prefix + company + urls.complaintTypes,
        headers: {
          version: '1',
          'x-auth': token,
        },
      });
      const {data} = response;
      if (data.success) {
        const {
          data: {complaint_types},
        } = data;
        setComplainTypes(complaint_types);
        setIsLoading(false);
      } else {
        const {errors} = data;
        if (errors.id) {
        } else {
          Alert.alert(null, 'Unable to fetch complaints data.');
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const PendingView = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Waiting</Text>
    </View>
  );

  const handleCamera = () => {
    const options = {quality: 0.5, base64: true};

    askCameraPermission(async () => {
      try {
        const result = await launchCamera(options);

        if (result.didCancel) {
          return;
        }

        if (result.assets) {
          const image = result.assets[0];

          setUri(image.uri);
        } else {
          console.log(result);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const getComplainFeedbackType = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        method: 'GET',
        url: urls.prefix + company + urls.complaintFeedbackTypes,
        headers: {
          version: '1',
          'x-auth': token,
        },
      });

      const {data} = response;

      if (data.success) {
        const {
          data: {complaint_feedback_types},
        } = data;
        setComplainFeedbackTypes(complaint_feedback_types);
        setIsLoading(false);
      } else {
        const {errors} = data;
        if (errors.id) {
        } else {
          Alert.alert(null, 'Unable to fetch complaints data.');
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <View style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <View style={[styles.input_container, {marginBottom: 0}]}>
          <Text style={styles.label}>Complaint Type</Text>
          <Picker
            selectedValue={selectedComplainTypes}
            style={{height: 50}}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedComplainTypes(itemValue)
            }>
            <Picker.Item label={'Select a method'} value={'none'} />
            {complainTypes.map((e, key) => {
              return <Picker.Item key={key} label={e.name} value={e._id} />;
            })}
          </Picker>
        </View>
        <View style={styles.input_container}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.input_text}
            multiline={true}
            numberOfLines={3}
            onChangeText={desc => {
              setMessage(desc);
            }}
            placeholder="Description"
            value={message}
          />
        </View>
        <View style={styles.input_container}>
          <Text style={styles.label}>Image</Text>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            {uri === '' ? null : (
              <Image source={{uri}} style={{width: 100, height: 100}} />
            )}
          </View>
        </View>
        <Button mode="contained" style={styles.btn} onPress={handleCamera}>
          {' '}
          Open Camera
        </Button>

        <TouchableOpacity
          style={styles.button_container}
          onPress={() => {
            onHandleSubmit();
          }}>
          <View style={styles.button}>
            {isLoading ? (
              <ActivityIndicator animating={true} size={18} color={'white'} />
            ) : (
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 18,
                  letterSpacing: 1,
                }}>
                SUBMIT
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddComplainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  label: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  preview: {
    flex: 1,
  },

  input_text: {
    borderColor: theme.primaryColorDark,
    backgroundColor: '#f0f0f0',
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
    width: '60%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  btn: {
    backgroundColor: theme.primaryColor,
    width: '50%',
    alignSelf: 'center',
  },
});

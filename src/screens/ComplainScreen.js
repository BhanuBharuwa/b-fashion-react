import AsyncStorage from '@react-native-community/async-storage';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {Button, Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../constants/theme';
import {urls} from '../constants/urls';

const ComplainScreen = ({navigation}) => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [complainTypes, setComplainTypes] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedComplain, setSelectedComplain] = useState({});
  const [selectedComplainTypes, setSelectedComplainTypes] = useState('none');
  const [complainVisiable, setComplainVisiable] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [feedback, setFeedback] = useState('');
  const [complainFeedbackTypes, setComplainFeedbackTypes] = useState([]);
  const [uri, setUri] = useState('');

  const [selectedComplainFeedbackTypes, setSelectedComplainFeedbackTypes] =
    useState('none');

  const handleCamera = async () => {
    const options = {quality: 0.5, base64: true};

    try {
      const res = await launchCamera(options);

      if (res.didCancel) {
        return;
      }

      setUri(res.assets[0].uri);
    } catch (err) {
      console.log('camera err', err);
    }
  };

  useEffect(() => {
    getComplainsData();
    getComplainFeedbackType();
    getComplainType();
  }, []);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const showComplainModal = () => setComplainVisiable(true);
  const hideComplainModal = () => setComplainVisiable(false);

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
  const getComplainsData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        method: 'GET',
        url: urls.prefix + company + urls.complaints,
        headers: {
          version: '1',
          'x-auth': token,
        },
      });

      const {data} = response;

      if (data.success) {
        const {
          data: {complaints},
        } = data;
        setComplaints(complaints);
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

  const onEditHandle = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const datas = new FormData();
      datas.append('customer_id', selectedComplain.customer_id);
      datas.append('complaint_type_id', selectedComplainTypes);
      datas.append('_method', 'PUT');
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
        url:
          urls.prefix + company + urls.complaints + '/' + selectedComplain._id,
        headers: {
          version: '1',
          'x-auth': token,
          'Content-type': 'multipart/form-data',
        },
        data: datas,
      });
      const {data} = response;
      if (data.success) {
        getComplainsData();
        alert('Complain has successfully updated');
        hideComplainModal();
      } else {
        const {errors} = data;

        if (errors.id) {
          alert(errors.id);
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
  const onHandleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios({
        method: 'POST',
        url:
          urls.prefix +
          company +
          urls.complaints +
          '/' +
          selectedId +
          '/add-feedback',
        headers: {
          version: '1',
          'x-auth': token,
        },
        data: {
          complaint_feedback_type_id: selectedComplainFeedbackTypes,
          feedback: feedback,
        },
      });
      const {data} = response;
      if (data.success) {
        getComplainsData();
        alert('Feedback has successfully added');
        hideModal();
      } else {
        const {errors} = data;
        if (errors.id) {
          alert(errors.id);
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

  const FeedbackModel = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        hideModal;
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{width: '100%', flexDirection: 'row'}}>
            <Text
              style={{
                width: '90%',
                color: theme.primaryColor,
                fontWeight: 'bold',
              }}>
              Add Feedback
            </Text>
            <Button
              onPress={() => setVisible(false)}
              style={{alignSelf: 'flex-end'}}
              small
              transparent>
              <Icon name="close" color="#000" size={20} />
            </Button>
          </View>
          <Text style={styles.label}>Complain Feedback Type</Text>
          <Picker
            selectedValue={selectedComplainFeedbackTypes}
            style={{height: 50, width: '100%'}}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedComplainFeedbackTypes(itemValue);
            }}>
            <Picker.Item
              label={'Select a complain Feedback Type'}
              value={'none'}
            />
            {complainFeedbackTypes.map((e, key) => {
              return <Picker.Item key={key} label={e.name} value={e._id} />;
            })}
          </Picker>
          <Text style={styles.label}>Feedback</Text>
          <TextInput
            style={styles.input_text}
            multiline={true}
            numberOfLines={3}
            onChangeText={desc => {
              setFeedback(desc);
            }}
            placeholder="Description"
            value={feedback}
          />
          <Button
            color={theme.primaryColor}
            onPress={() => {
              onHandleSubmit();
            }}>
            submit
          </Button>
        </View>
      </View>
    </Modal>
  );

  const EditComplainModel = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={complainVisiable}
      onRequestClose={() => {
        hideComplainModal;
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{width: '100%', flexDirection: 'row'}}>
            <Text
              style={{
                width: '90%',
                color: theme.primaryColor,
                fontWeight: 'bold',
              }}>
              Edit Complain
            </Text>
            <Button
              onPress={() => hideComplainModal()}
              style={{alignSelf: 'flex-end'}}
              small
              transparent>
              <Icon name="close" color="#000" size={20} />
            </Button>
          </View>
          <Text style={styles.label}>Complain Type</Text>
          <Picker
            selectedValue={selectedComplainTypes}
            style={{height: 50, width: '100%'}}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedComplainTypes(itemValue);
            }}>
            <Picker.Item
              label={'Select a complain Feedback Type'}
              value={'none'}
            />
            {complainTypes.map((e, key) => {
              return <Picker.Item key={key} label={e.name} value={e._id} />;
            })}
          </Picker>
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
            <Button onPress={handleCamera}> Open Camera</Button>
          </View>
          <Button
            color={theme.primaryColor}
            onPress={() => {
              onEditHandle();
            }}>
            Update
          </Button>
        </View>
      </View>
    </Modal>
  );
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

  return (
    <View style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <FlatList
          data={complaints}
          refreshing={isLoading}
          onRefresh={getComplainsData}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{marginTop: 10}}
          keyExtractor={(item, _) => item._id}
          renderItem={({item}) => (
            <Card key={item.key} style={styles.item}>
              <View style={styles.row}>
                <Text style={styles.title}>#{item.complaint_number}</Text>
                <Text style={[styles.title, {alignSelf: 'center'}]}>
                  {moment(item.created_at).format('YYYY-MM-DD')}
                </Text>
              </View>
              <View style={styles.row}>
                <View style={styles.billDetails}>
                  <Text>
                    <Icon name="message-alert-outline" size={16} />{' '}
                    {item.complaint_type_name}
                  </Text>
                  <Text>
                    <Icon name="receipt" size={16} /> {item.status}
                  </Text>
                  <Text>
                    <Icon name="contacts-outline" size={16} />{' '}
                    {item.customer_name}
                  </Text>
                </View>
                <View style={styles.amountWrapper}>
                  <Button
                    onPress={() => {
                      navigation.navigate('ViewComplainScreen', {
                        id: item._id,
                      });
                    }}
                    color={theme.primaryColor}>
                    View
                  </Button>
                  <Button
                    color={theme.primaryColor}
                    onPress={() => {
                      setSelectedComplainTypes(item.complaint_type_id);
                      setMessage(item.message);
                      setSelectedComplain(item);
                      setUri(item.photo_url);
                      showComplainModal();
                    }}
                    disabled={item.status == 'open' ? false : true}>
                    edit
                  </Button>
                  {/* <Button
                      color={theme.primaryColor}
                      onPress={() => {
                        setSelectedId(item._id);
                        showModal();
                      }}
                      disabled={item.status == 'open' ? false : true}>
                      Feedback
                    </Button> */}
                </View>
              </View>
            </Card>
          )}
        />
        {FeedbackModel()}
        {EditComplainModel()}
      </View>
    </View>
  );
};

export default ComplainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  label: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  input_text: {
    borderColor: theme.primaryColorDark,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 10,
    marginTop: 5,
    height: Platform.OS === 'ios' ? 30 : null,
  },
  item: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },

  row: {
    marginVertical: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  button_container: {
    backgroundColor: theme.primaryColorDark,
    paddingVertical: 10,
    width: '60%',
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  billDetails: {
    flex: 1,
    justifyContent: 'space-around',
  },

  amountWrapper: {
    width: '40%',
    alignItems: 'flex-end',
  },
  preview: {
    flex: 1,
  },
});

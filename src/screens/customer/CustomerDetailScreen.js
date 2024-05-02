'use strict';
import AsyncStorage from '@react-native-community/async-storage';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import Orientation, {
  OrientationLocker,
  PORTRAIT,
} from 'react-native-orientation-locker';

import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {ScrollView} from 'react-native-gesture-handler';
import {launchCamera} from 'react-native-image-picker';
import {
  ActivityIndicator,
  Button,
  Card,
  Dialog,
  Divider,
  IconButton,
  Modal,
  Portal,
  Searchbar,
  SegmentedButtons,
  Subheading,
  Surface,
  Text,
} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListItem from '../../components/ListItem';
import LoadingScreen from '../../components/LoadingScreen';
import {colors, theme} from '../../constants/theme';
import {urls} from '../../constants/urls';
import BillPayment from '../../svg/BillPayment.js';
import CreditCardPayment from '../../svg/CreditCardPayment.js';
import CustomerSupport from '../../svg/CustomerSupport.js';
import OrderPlaced from '../../svg/OrderPlaced.js';
import SaveMoney from '../../svg/SaveMoney.js';
import {askCameraPermission} from '../../utils/camera_permission';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {clearCart} from '../../store/slices/order.slice.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ElementPicker from '../../components/ElementPicker';
import SegmentedControl from '../../components/SegmentedControl.js';
import OrderSalesScreen from './OrderSalesScreen.js';

const height = Dimensions.get('window').height;

const CustomerDetailScreen = ({navigation, route}) => {
  const {id, permissions} = route.params;
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [customerData, setCustomer] = useState(route.params.customer);
  const [value, setValue] = useState(0);
  const [start, setStart] = useState(false);
  const checkstatus = route.params.punchStatus;

  const [isLoading, setIsLoading] = useState(false);
  const [checkOutVisible, setcheckOutVisible] = useState(false);
  const [showOrderModel, setShowOrderModel] = useState(false);
  const [showShareModel, setShowShareModel] = useState(false);
  const [feedbackOption, setFeedbackOption] = useState([]);
  const [uri, setUri] = useState('');
  const [location, setLocation] = useState({});
  const [selectedFeedback, setSelectedFeedback] = useState('none');
  const [isPhotoRequired, setIsPhotoRequired] = useState(false);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [customerBalance, setCustomerBalance] = useState({});
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [distributorModal, setDistributorModal] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [distributors, setDistributors] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [self, setSelf] = useState(0);

  useEffect(() => {
    if (checkstatus.status && checkstatus.customer_id == id) {
      setStart(true);
    }
    getCustomerBalance();
    getFeedbacks();
    getCustomerDetail();
    fetchDistributors(1, '');
  }, []);

  const fetchDistributors = async (page, name) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.distributors,
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
        },
        params: {
          page,
          term: name,
        },
      });

      if (response.data.success === true) {
        if (page === 1) {
          setDistributors(response.data.data.distributors);
        } else {
          setDistributors(distributors.concat(response.data.data.distributors));
        }
        setHasMore(response.data.data.hasMore);
      } else {
        Alert.alert('Distributor error', JSON.stringify(response.data.errors));
      }
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToPortrait();
      dispatch(clearCart());
    }, []),
  );
  
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginRight: 20}}
            onPress={() => {
              start
                ? setShowShareModel(true)
                : Alert.alert('Error', 'Please Check In');
            }}>
            <Icon name="share-variant" size={25} color={theme.primaryColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [start]);

  const getCustomerBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      console.log(token);
      console.log(id);

      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url:
          urls.prefix +
          company +
          urls.customers +
          '/' +
          id +
          '/outstanding-balance',
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
        },
      });
      if (response.data.success === true) {
        setCustomerBalance(response.data.data);
      } else {
      }
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const getCustomerDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.customers + '/' + id,
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
        },
      });
      if (response.data.success === true) {
        setCustomer(response.data.data);
        setIsScreenLoading(false);
      } else {
        setIsScreenLoading(false);
      }
    } catch (error) {
      setIsScreenLoading(false);
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const getFeedbacks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.feedback,
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
        },
      });
      if (response.data.success === true) {
        setFeedbackOption(response.data.data.customer_visit_feebacks);
      } else {
      }
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const fetchMyLocation = async () => {
    try {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('always');
        Geolocation.getCurrentPosition(
          position => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          error => {
            alert('Please turn on the Location.');
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            showLocationDialog: true,
            forceRequestLocation: true,
          },
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Access Location Permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            error => {
              alert('Please turn on the Location.');
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
              showLocationDialog: true,
              forceRequestLocation: true,
            },
          );
        } else {
          Alert.alert('Error', 'Location permission denied');
        }
      }
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const checkInRequestLocationPermission = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('always');
        Geolocation.getCurrentPosition(
          position => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setDistributorModal(true);
            // checkIn(position.coords.latitude, position.coords.longitude);
          },
          error => {
            alert('Please turn on the Location.');
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            showLocationDialog: true,
            forceRequestLocation: true,
          },
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Access Location Permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              setCurrentLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              setDistributorModal(true);
              //  checkIn(position.coords.latitude, position.coords.longitude);
            },
            error => {
              alert('Please turn on the Location.');
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
              showLocationDialog: true,
              forceRequestLocation: true,
            },
          );
        } else {
          Alert.alert('Error', 'Location permission denied');
        }
      }
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const checkOutRequestLocationPermission = async () => {
    setIsFeedbackSubmitted(true);

    try {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('always');
        Geolocation.getCurrentPosition(
          position => {
            checkOut(position.coords.latitude, position.coords.longitude);
          },
          error => {
            alert('Please turn on the Location.');
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            showLocationDialog: true,
            forceRequestLocation: true,
          },
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Access Location Permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              checkOut(position.coords.latitude, position.coords.longitude);
            },
            error => {
              alert('Please turn on the Location.');
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
              showLocationDialog: true,
              forceRequestLocation: true,
            },
          );
        } else {
          Alert.alert('Error', 'Location permission denied');
        }
      }
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const sendFeedback = async () => {
    setIsFeedbackSubmitted(true);

    try {
      const data = new FormData();
      data.append('customer_visit_feedback_id', selectedFeedback);
      if (uri) {
        data.append('photo', {
          uri: uri,
          type: 'image/jpeg',
          name: 'avatar',
        });
      }
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.saveFeedback,
        method: 'POST',
        headers: {
          'x-auth': token,
          version: '1',
          'Content-type': 'multipart/form-data',
        },
        data: data,
      });

      if (response.data.success === true) {
        Snackbar.show({
          text: 'Feedback submitted',
          duration: Snackbar.LENGTH_SHORT,
        });
        setcheckOutVisible(false);
        setIsFeedbackSubmitted(false);
        setUri('');
      } else {
        setcheckOutVisible(false);
        setIsFeedbackSubmitted(false);
      }
    } catch (error) {
      setIsVisible(false);
      setIsFeedbackSubmitted(false);
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const checkIn = async () => {
    if (!selectedDistributor) {
      Alert.alert('Error', 'A distributor must be selected');
      return;
    }

    if (uri === '') {
      Alert.alert('Error', 'Add photo by clicking on Camera Button');
      return;
    }

    setDistributorModal(false);


    try {
      const formData = new FormData();

      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      formData.append('customer_id', id);
      formData.append('distributor_id', selectedDistributor);
      formData.append('latitude', currentLocation.latitude);
      formData.append('longitude', currentLocation.longitude);
      formData.append('photo', {
        uri: uri,
        name: 'customer',
        type: 'image/jpeg',
      });

      const response = await axios({
        url: urls.prefix + company + urls.checkIn,
        method: 'POST',
        headers: {
          'x-auth': token,
          version: '1',
          'Content-type': 'multipart/form-data',
        },
        data: formData,
      });

      console.log(response.data);

      if (response.data.success === true) {
        setIsLoading(false);
        setStart(true);
        let phone =
          customerData.contact_number !== null
            ? customerData.contact_number
            : '';
        await AsyncStorage.setItem('customer_mobile', phone);
        await AsyncStorage.setItem('customer_name', customerData.name);
        await AsyncStorage.setItem('carts', JSON.stringify([]));
        setUri('');
        //  const res = await MapmyIndiaIntouch.getCurrentLocationUpdate();
      } else {
        setStart(false);
        setIsLoading(false);
        if (response.data.errors.check_in === 'feedback_pending') {
          setcheckOutVisible(true);
        }
        if (response.data.errors.punch_in) {
          showSnackbar(response.data.errors.punch_in);
        }
        if (response.data.errors.check_in) {
          showSnackbar(response.data.errors.check_in);
        }
        if (response.data.errors.customer_id) {
          showSnackbar(response.data.errors.customer_id);
        }
      }
    } catch (error) {
      setStart(false);
      setIsLoading(false);
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const checkOut = async (lat, lng) => {
    try {
      const data = new FormData();
      data.append('latitude', lat);
      data.append('longitude', lng);
      data.append('customer_visit_feedback_id', selectedFeedback);

      if (uri) {
        data.append('photo', {
          uri: uri,
          type: 'image/jpeg',
          name: 'avatar',
        });
      }
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.checkOut,
        method: 'POST',
        headers: {
          'x-auth': token,
          version: '1',
          'Content-type': 'multipart/form-data',
        },
        data,
      });

      console.log('check out', response.data);

      if (response.data.success === true) {
        setcheckOutVisible(false);
        setIsFeedbackSubmitted(false);
        navigation.navigate('SurveyScreen');
        await AsyncStorage.setItem('customer_mobile', '');
      } else {
        setIsLoading(false);
        setIsFeedbackSubmitted(false);

        const {customer_visit_feedback_id, photo} = response.data.errors;

        if (customer_visit_feedback_id) {
          Snackbar.show({text: customer_visit_feedback_id});
          return;
        }

        if (photo) {
          Snackbar.show({text: photo});
          return;
        }

        setcheckOutVisible(false);

        setStart(false);
        setSelectedFeedback('none');
      }
    } catch (error) {
      console.log('check out err', err.response.data);

      setcheckOutVisible(false);
      setIsFeedbackSubmitted(false);
      setIsLoading(false);
      setStart(false);
      Alert.alert('Error', JSON.stringify(error));
      setSelectedFeedback('none');
    }
  };

  const takePicture = async camera => {
    fetchMyLocation();
    const options = {quality: 0.5, base64: true};
    // const data = await camera.takePictureAsync(options);
    // setUri(data.uri);
    // setCameraVisible(false);
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

  useEffect(() => {
    checkPhotoRequirement();
  }, [selectedFeedback]);

  const handleFeedback = value => {
    setSelectedFeedback(value);

    feedbackOption.map(e => {
      if (e._id === value) {
        setIsPhotoRequired(e.is_photo_required);
      }
    });
  };

  const checkPhotoRequirement = () => {
    if (!isPhotoRequired) {
      setUri('');
    }
  };

  const ShareModel = () => (
    <Modal
      animationType="fade"
      transparent={false}
      onDismiss={() => setShowShareModel(false)}
      visible={showShareModel}
      contentContainerStyle={styles.modalContainerStyle}>
      <View style={styles.input_container}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('RecentOrderScreen', {id: id});
            setShowShareModel(false);
          }}
          style={[
            styles.capture,
            {
              flexDirection: 'row',
              borderBottomWidth: 1,
              padding: 10,
              borderColor: '#f0f0f0',
            },
          ]}>
          <Icon
            name="cart-outline"
            style={{marginTop: 2}}
            size={16}
            color={theme.primaryColorDark}
          />
          <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 14}}>
            Order
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('RecentPaymentScreen', {id: id});
            setShowShareModel(false);
          }}
          style={[
            styles.capture,
            {
              flexDirection: 'row',
              borderBottomWidth: 1,
              padding: 10,
              borderColor: '#f0f0f0',
            },
          ]}>
          <Icon
            name="cash-multiple"
            style={{marginTop: 2}}
            size={16}
            color={theme.primaryColorDark}
          />
          <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 14}}>
            Payment
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const OrderModel = () => (
    <Modal
      animationType="fade"
      transparent={false}
      onDismiss={() => setShowOrderModel(false)}
      visible={showOrderModel}
      contentContainerStyle={styles.modalContainerStyle}>
      <View style={styles.input_container}>
        <Text style={{marginBottom: 8}}>Select an option</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CategoryListScreen');
            setShowOrderModel(false);
          }}
          style={[
            styles.capture,
            {
              flexDirection: 'row',
              borderBottomWidth: 1,
              padding: 10,
              borderColor: '#f0f0f0',
            },
          ]}>
          <Icon
            name="folder-multiple-outline"
            style={{marginTop: 2}}
            size={16}
            color={theme.primaryColorDark}
          />
          <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 14}}>
            Browse a Category
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProductListScreen', {id: ''});
            setShowOrderModel(false);
          }}
          style={[
            styles.capture,
            {
              flexDirection: 'row',
              borderBottomWidth: 1,
              padding: 10,
              borderColor: '#f0f0f0',
            },
          ]}>
          <Icon
            name="clipboard-list-outline"
            style={{marginTop: 2}}
            size={16}
            color={theme.primaryColorDark}
          />
          <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 14}}>
            All Products
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  //Shop Detail Tab Design
  const FirstRoute = () => (
    <View style={styles.list_item}>
      <ListItem title="Name" value={customerData.name} />
      <ListItem title="SAP Code" value={customerData.sap_code} />
      <ListItem title="Email" value={customerData.email} />
      <ListItem title="Contact Number" value={customerData.contact_number} />
      <ListItem title="Address" value={customerData.address} />
      <ListItem title="Country" value="India" />
      <ListItem title="State" value={customerData.state_name} />
      <ListItem title="City" value={customerData.city_name} />
      <ListItem title="Area" value={customerData.area_name} />
    </View>
  );

  //Shop Activity Tab Design
  const SecondRoute = () => (
    <View style={styles.list_item}>
      <View style={styles.btn_list}>
        {permissions['add-order-api'] && (
          <Surface style={styles.btn_design}>
            <TouchableOpacity
              onPress={() => {
                start
                  ? navigation.navigate('CategoryListScreen')
                  : Alert.alert('Denied', 'Please check in first!');
              }}>
              <OrderPlaced />
              <Text style={styles.vender_name}>Add Order</Text>
            </TouchableOpacity>
          </Surface>
        )}
        {/* {permissions['add-payment-api'] == true ? (
          <Surface style={styles.btn_design}>
            <TouchableOpacity
              onPress={() => {
                start
                  ? navigation.navigate('AddPaymentScreen', {
                      name: customerData.name,
                      email: customerData.email,
                      phone: customerData.contact_number,
                      CustomerBalance: customerBalance.due_amount,
                    })
                  : Alert.alert('Denied', 'Please check in first!');
              }}>
              <CreditCardPayment />
              <Text style={styles.vender_name}>Payment</Text>
            </TouchableOpacity>
          </Surface>
        ) : null} */}
        <Surface style={styles.btn_design}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddComplainScreen', {id: id});
            }}>
            <CustomerSupport />
            <Text style={styles.vender_name}>Customer{'\n'}feedback</Text>
          </TouchableOpacity>
        </Surface>
      </View>
      <View style={{alignSelf: 'center'}}>
        <SegmentedControl
          tabs={['My sales', 'Outlet sales']}
          onChange={(i) => {
            setSelf(i);
            //fetchOrderSales(i)
          }}
          currentIndex={self}
          paddingVertical={6}
          activeTextColor={colors.primary}
          segmentedControlBackgroundColor={colors.primary}
          textColor={colors.light}
          width={250}
        />
      </View>
      {/* <SegmentedButtons
        value={self}
        style={{
          width: 250,
          alignSelf: 'center',
          marginVertical: 10,
        }}
        onValueChange={val => {
          setSelf(val);

          fetchOrderSales(val);
        }}
        buttons={[
          {
            value: 'true',
            label: 'My sales',
          },
          {
            value: 'false',
            label: 'Outlet sales',
          },
        ]}
      /> */}
      <Divider />
      <Divider />
      <Divider />
      <OrderSalesScreen self={self} id={id} />
    </View>
  );

  function showSnackbar(text) {
    Snackbar.show({
      text,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <>
        <Card style={styles.contact_section}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View>
              <Text style={styles.title}>{customerData.name}</Text>
              <Text>{customerData.contact_number}</Text>
            </View>
            {permissions['check-in-out-api'] == true &&
              customerData.is_confirmed && (
                <Button
                  loading={isLoading}
                  onPress={() => {
                    start === false
                      ? checkInRequestLocationPermission()
                      : setcheckOutVisible(true);
                  }}
                  icon={
                    checkstatus === 'Check In'
                      ? 'sticker-check'
                      : 'sticker-check-outline'
                  }
                  mode="contained">
                  {start ? 'Check Out' : 'Check In'}
                </Button>
              )}
          </View>
          <View style={styles.contact}>
            <IconButton
              icon="pencil-outline"
              style={styles.fab}
              size={24}
              iconColor={theme.primaryColor}
              containerColor="#fff"
              mode="contained"
              onPress={() => {
                permissions['edit-customer-api']
                  ? navigation.navigate('UpdateCustomerScreen', {
                      data: {customerData, id},
                    })
                  : Alert.alert('Permission', 'Not Permitted');
              }}
            />
            <IconButton
              icon="map-marker-circle"
              style={styles.fab}
              iconColor={
                customerData.latitude == null ? 'gray' : theme.primaryColor
              }
              size={24}
              mode="contained"
              containerColor="#fff"
              onPress={() => {
                permissions['add-geolocation-api']
                  ? // setUpdateLocationVisibility(true)
                    navigation.navigate('UpdateLocation', {
                      data: {customerData, id},
                    })
                  : Alert.alert('Permission', 'Not Permitted');
              }}
            />
            <IconButton
              icon="message-text-outline"
              style={styles.fab}
              size={24}
              iconColor={theme.primaryColor}
              containerColor="#fff"
              mode="contained"
              onPress={() => {
                Linking.openURL(`sms:${customerData.contact_number}`);
              }}
            />
            <IconButton
              icon="phone-in-talk-outline"
              style={styles.fab}
              size={24}
              mode="contained"
              iconColor={theme.primaryColor}
              containerColor="#fff"
              onPress={() => {
                let phoneNumber = '';
                if (Platform.OS === 'android') {
                  phoneNumber = `tel:${customerData.contact_number}`;
                } else {
                  phoneNumber = `telprompt:${customerData.contact_number}`;
                }
                Linking.openURL(phoneNumber);
              }}
            />
            <IconButton
              icon="whatsapp"
              style={styles.fab}
              size={24}
              mode="contained"
              iconColor={theme.primaryColor}
              containerColor="#fff"
              onPress={() => {
                let mobile =
                  Platform.OS == 'ios'
                    ? customerData.contact_number
                    : '+' + customerData.contact_number;
                let url = 'whatsapp://send?phone=' + mobile;
                Linking.openURL(url)
                  .then(data => {})
                  .catch(() => {
                    alert('Make sure WhatsApp installed on your device');
                  });
              }}
            />
          </View>
        </Card>
        <Card style={styles.actvityContainer}>
          <SegmentedControl
            tabs={['Activity', 'Detail']}
            onChange={setValue}
            currentIndex={value}
            paddingVertical={6}
            activeTextColor={colors.primary}
            segmentedControlBackgroundColor={colors.primary}
            textColor={colors.light}
          />
          {/* <SegmentedButtons
            value={value}
            style={{
              width: 250,
              alignSelf: 'center',
              marginVertical: 10,
            }}
            onValueChange={setValue}
            buttons={[
              {
                value: 'activity',
                label: 'Activity',
              },
              {
                value: 'detail',
                label: 'Detail',
              },
            ]}
          /> */}
          {value === 0 ? <SecondRoute /> : <FirstRoute />}
        </Card>
        <Portal>
          <Modal
            animationType="fade"
            transparent={false}
            onDismiss={() => setcheckOutVisible(false)}
            visible={checkOutVisible}
            contentContainerStyle={styles.modalContainerStyle}>
            <View style={styles.input_container}>
              <Text style={styles.label}>Please provide a feedback</Text>
              <Picker
                selectedValue={selectedFeedback}
                style={{height: 50}}
                onValueChange={itemValue => handleFeedback(itemValue)}>
                <Picker.Item label={'Choose one'} value={'none'} />
                {feedbackOption.map((e, key) => {
                  return <Picker.Item key={key} label={e.name} value={e._id} />;
                })}
              </Picker>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-around',
                  width: '100%',
                }}>
                {isPhotoRequired ? (
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.primaryColor,
                      padding: 5,
                      height: 40,
                      borderRadius: 10,
                    }}
                    onPress={() => takePicture()}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name="camera" size={30} color="white" />
                      <Text style={{color: 'white'}}>Take Photo</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {uri === '' ? null : (
                  <View>
                    <Image source={{uri}} style={{width: 100, height: 100}} />
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
                start ? checkOutRequestLocationPermission() : sendFeedback();
              }}>
              {isFeedbackSubmitted ? (
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
            </TouchableOpacity>
          </Modal>
          {ShareModel()}
          {OrderModel()}
        </Portal>

        <LoadingScreen visible={isScreenLoading} text="Fetching details" />
        <Portal>
          <Dialog
            visible={distributorModal}
            dismissable={false}
            style={styles.checkInDialog}>
            <Dialog.Title>Check In</Dialog.Title>
            <Dialog.Content style={{paddingHorizontal: 16,}}>
              <ElementPicker
                data={distributors}
                selectedValue={selectedDistributor}
                iconName="truck"
                isModal={true}
                onChangeText={text => fetchDistributors(1, text)}
                placeholder="Select distributor"
                onClearPress={() => setSelectedDistributor('')}
                onValueSelect={item => setSelectedDistributor(item._id)}
              />
              {/* <Subheading>Add Photo :</Subheading> */}
              <View style={styles.addPhotoContainer}>
                <Subheading>Add Photo :</Subheading>
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={() => takePicture()}>
                  <Icon name="camera-plus" size={25} color="white" />
                </TouchableOpacity>

              </View>

              {uri === '' ? null : (<View style={styles.photoView} >
                <Image source={{ uri }} style={styles.checkInImage} />
                <View style={{ margin: 10 }}>
                  <Text>Latitude: {location.latitude}</Text>
                  <Text>Longitude: {location.longitude}</Text>
                  <Text>{moment().format('h:mm A - YYYY/MM/DD')}</Text>
                </View>
              </View>)}

              {/* <TouchableOpacity
                style={{
                  backgroundColor: theme.primaryColor,
                  padding: 5,
                  height: 40,
                  borderRadius: 10,
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: '70%',
                }}
                onPress={() => takePicture()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name="camera" size={30} color="white" />
                  <Text style={{color: 'white'}}>Take Photo</Text>
                </View>
              </TouchableOpacity>

              {uri === '' ? null : ( 
                <View style={{marginVertical: 10}}>
                  <Image source={{uri}} style={{width: 100, height: 100}} />
                  <View>
                    <Text>Latitude: {location.latitude}</Text>
                    <Text>Longitude: {location.longitude}</Text>
                    <Text>{moment().format('h:mm A - YYYY/MM/DD')}</Text>
                  </View>
                </View>
              )} */}
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setIsLoading(false);
                  setDistributorModal(false);
                }}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  checkIn();
                }}>
                Check in
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </>
    </ScrollView>
  );
};

export default CustomerDetailScreen;
//Style sheet for this page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    // marginBottom: 20,
  },
  btn_list: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  btn_design: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  contact_section: {
    padding: 10,
    backgroundColor: '#fff',
  },
  amountTextContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 5,
  },
  fab: {
    elevation: 3,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontWeight: 'bold',
    color: theme.primaryColorDark,
    fontSize: 18,
  },
  vender_name: {
    marginTop: 5,
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
  vender: {
    flexDirection: 'row',
    padding: 20,
  },
  contact: {
    flexDirection: 'row',
    marginTop: 10,
    alignSelf: 'center',
  },
  activity_item: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginVertical: 6,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  text_date: {
    marginStart: 20,
  },
  preview: {
    flex: 1,
  },
  checkbox: {
    position: 'absolute',
    right: 20,
  },
  button_container: {
    backgroundColor: theme.primaryColorDark,
    paddingVertical: 10,
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  label: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actvityContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    // paddingBottom: 30,
    marginBottom: 30,
  },

  input_container: {
    width: '90%',
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

  modalContainerStyle: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    marginHorizontal: 20,
    borderRadius: 20,
  },
  list_item: {
    padding: 10,
  },
  hightlight_text: {
    color: colors.light,
    opacity: 0.8,
    transform: [{ rotate: '-90deg'}],
  },
  hightlightTextContainer: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    width: 45,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    height: 80,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  col: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 3,
  },

  addPhotoButton: {
    backgroundColor: theme.primaryColor,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: "center",
    elevation: 3,
  },

  photoView: {
    flexDirection: 'row',
    height: 120, width: '100%',
    borderRadius: 15,
    shadowOpacity: 0.7,
    shadowOffset: { width: -4, height: -4 },
    shadowRadius: 10,
    elevation: 2,
    backgroundColor: 'white',
    overflow: 'hidden',
    marginTop: 10,
  },

  checkInDialog: {
    maxHeight: 0.8 * height,
    backgroundColor: colors.light,
    width: '95%',
    alignSelf: 'center',
  },

  addPhotoContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },

  checkInImage: { width: 120, height: '100%' },


});

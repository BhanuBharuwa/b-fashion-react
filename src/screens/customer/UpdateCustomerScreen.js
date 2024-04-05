import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TextInput, TouchableRipple} from 'react-native-paper';

import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import {Picker} from '@react-native-picker/picker';

import {theme} from '../../constants/theme';
import {urls} from '../../constants/urls';
import LoadingScreen from '../../components/LoadingScreen';

Geocoder.init('AIzaSyAZpUWh4WwNjHYJGuKyTpm4qW3MCaXnrjQ');

const UpdateCustomerScreen = ({route, navigation}) => {
  const {customerData, id} = route.params.data;

  const [areas, setAreas] = useState([]);
  const [sap_code, setSapCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [address, setAddress] = useState('');
  const [selectedArea, setSelectedArea] = useState('none');
  const [loadingVisibility, setLoadingVisibility] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    fetchAllAreas();
    fetchCurrentLocation();
    setData();
  }, []);

  function setData() {
    setEmail(customerData.email);
    setName(customerData.name);
    setSapCode(customerData.sap_code);
    setAddress(customerData.address);
    setLatitude(customerData.latitude);
    setLongitude(customerData.longitude);
    setPhone(customerData.contact_number);
    setSelectedArea(customerData.area_id);
    console.log(customerData);
  }

  const fetchAllAreas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.areas,
        method: 'GET',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
      });

      if (response.data.success) {
        setAreas(response.data.data.areas);
      } else {
        console.log(response.data.errors);
      }
    } catch (error) {
      console.log('AddCustomerScreen/catch: ', error);
      Alert.alert('Error', error);
    }
  };

  const fetchCurrentAddress = () => {
    setLocationLoading(true);
    Geocoder.from(latitude, longitude)
      .then(json => {
        var addressComponent = json.results[0].formatted_address;
        setAddress(addressComponent);
        setLocationLoading(false);
      })
      .catch(error => {
        setLocationLoading(false);
        console.warn(error);
      });
  };

  const fetchCurrentLocation = async () => {
    try {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('always');
        Geolocation.getCurrentPosition(
          position => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
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
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);
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
      alert(error);
    }
  };

  function showSnackbar(text) {
    Snackbar.show({
      text,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  function validation() {
    //   let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    //   if (reg.test(email) === false) {
    //     showSnackbar('Please provide valid an email address');
    //     return false;
    //   }

    // if (name === '') {
    //     showSnackbar('Please provide a customer name')
    //     return false
    // }

    // if (sap_code === '') {
    //     showSnackbar('Please provide a SAP Code')
    //     return false
    // }

    // if (address === '') {
    //     showSnackbar('Please provide an address')
    //     return false
    // }

    // if (phone === '') {
    //     showSnackbar('Please provide a customer phone number')
    //     return false
    // }

    // if (selectedArea === 'none') {
    //     showSnackbar('Please select an area')
    //     return false
    // }
    return true;
  }

  const handleSubmit = () => {
    if (validation()) {
      let data = {
        area_id: selectedArea,
        sap_code,
        name,
        email,
        contact_number: phone,
        longitude,
        latitude,
        address,
      };
      if (customerData.is_confirmed) {
        submitContactUpdate(data);
      } else {
        submitUpdate(data);
      }
    }
  };

  const submitUpdate = async data => {
    setLoadingVisibility(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.customers + `/${id}`,
        method: 'PUT',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
        data,
      });

      if (response.data.success) {
        setLoadingVisibility(false);
        Alert.alert('Success', 'Customer has been updated succesfully.');
        navigation.goBack();
      } else {
        setLoadingVisibility(false);
        setLoadingVisibility(false);
        if (response.data.errors.id) {
          showSnackbar(response.data.errors.id);
        }
        if (response.data.errors.email) {
          showSnackbar(response.data.errors.email);
        }
        if (response.data.errors.contact_number) {
          showSnackbar(response.data.errors.contact_number);
        }
        if (response.data.errors.name) {
          showSnackbar(response.data.errors.name);
        }
        if (response.data.errors.area_id) {
          showSnackbar(response.data.errors.area_id);
        }
      }
    } catch (error) {
      setLoadingVisibility(false);
      console.log('UpdateCustomerScreen/submitUpdate: ', error);
      // Alert.alert('Error', error)
    }
  };

  const submitContactUpdate = async data => {
    setLoadingVisibility(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url:
          urls.prefix +
          company +
          urls.customers +
          `/${id}/update-contact-number`,
        method: 'POST',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
        data,
      });

      if (response.data.success) {
        setLoadingVisibility(false);
        Alert.alert(
          'Success',
          'Customer contact has been updated succesfully.',
        );
        navigation.goBack();
      } else {
        setLoadingVisibility(false);
        setLoadingVisibility(false);
        if (response.data.errors.id) {
          showSnackbar(response.data.errors.id);
        }
        if (response.data.errors.contact_number) {
          showSnackbar(response.data.errors.contact_number);
        }
      }
    } catch (error) {
      setLoadingVisibility(false);
      console.log('UpdateCustomerScreen/submitUpdate: ', error);
      // Alert.alert('Error', error)
    }
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.input_container}>
            <TextInput
              label="Customer Name"
              mode="outline"
              underlineColor={theme.primaryColor}
              style={styles.input_text}
              value={name}
              onChangeText={val => setName(val)}
            />
          </View>
          <View style={styles.input_container}>
            <TextInput
              label="SAP code"
              mode="outline"
              underlineColor={theme.primaryColor}
              style={styles.input_text}
              value={sap_code}
              onChangeText={val => setSapCode(val)}
            />
          </View>
          <View style={styles.input_container}>
            <TouchableRipple onPress={() => {}}>
              <View>
                <TextInput
                  label="Address"
                  mode="outline"
                  onChangeText={val => setAddress(val)}
                  underlineColor={theme.primaryColor}
                  style={styles.input_text}
                  value={address}
                />
              </View>
            </TouchableRipple>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => fetchCurrentAddress()}>
              <Text style={{color: 'green', marginEnd: 10}}>
                {' '}
                Click to fetch current location
              </Text>
              <ActivityIndicator animating={locationLoading} color="#00B0F7" />
            </TouchableOpacity>
          </View>
          <View style={styles.input_container}>
            <TextInput
              label="Contact Number"
              keyboardType={'phone-pad'}
              mode="outline"
              value={phone}
              underlineColor={theme.primaryColor}
              style={styles.input_text}
              onChangeText={val => setPhone(val)}
            />
          </View>
          <View style={styles.input_container}>
            <TextInput
              label="E-mail"
              keyboardType={'email-address'}
              mode="outline"
              underlineColor={theme.primaryColor}
              style={styles.input_text}
              value={email}
              onChangeText={val => {
                setEmail(val);
              }}
            />
          </View>
          <View style={styles.input_container}>
            <View style={styles.picker_container}>
              <Picker
                selectedValue={selectedArea}
                style={{height: 50}}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedArea(itemValue)
                }>
                <Picker.Item label={'Choose one area'} value={'none'} />
                {areas.map((e, key) => {
                  return <Picker.Item key={key} label={e.name} value={e._id} />;
                })}
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button_container}
            onPress={() => {
              handleSubmit();
            }}>
            <View style={styles.button}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 18,
                  letterSpacing: 1,
                }}>
                UPDATE
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LoadingScreen
        visible={loadingVisibility}
        text="Updating customer details"
      />
    </>
  );
};

export default UpdateCustomerScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },

  label: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },

  input_text: {
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginTop: 5,
    height: Platform.OS === 'ios' ? 50 : null,
  },

  input_container: {
    marginBottom: 10,
    borderRadius: 10,
  },

  picker_container: {
    width: '100%',
    backgroundColor: theme.inputBackground,
    borderRadius: 10,
  },

  button_container: {
    backgroundColor: theme.primaryColorDark,
    paddingVertical: 10,
    width: '60%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
});

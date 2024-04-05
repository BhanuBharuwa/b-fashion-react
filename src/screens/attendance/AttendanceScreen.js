import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import MapmyIndiaIntouch from 'mappls-intouch-react-native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import LoadingScreen from '../../components/LoadingScreen';
import {colors, theme} from '../../constants/theme';
import {urls} from '../../constants/urls';
import Attendance from '../../svg/Attendance';
import {Avatar, Card, Divider, Text, Title} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Greeting from './Greeting';
import DurationView from './DurationView';
import UserView from './UserView';

const AttendanceScreen = ({navigation, route}) => {
  const [visible, setVisible] = useState(false);
  const [LoadingText, setLoadingText] = useState('');
  const [profile, setProfile] = useState({});
  const clientId =
    '33OkryzDZsJ5ido6cJYIm2ErAaZow4Zjlp0EXltMBR4jjx6vbl48uKhhKgF4OTGjqyb28qilI8eskTu195Ra6g==';
  const clientSecret =
    'lrFxI-iSEg_s6-2SsDBWEMpsZZU9yvtk2zstKizYOiPXKv1zq0-U3bmRh20lRm7J7WsNhGHbGUs4DPdS0zMoF33TAJ4vh07B';

  useEffect(() => {
    accountDetails();
    const backAction = () => {
      navigation.navigate('DrawableStack');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const intouch = async () => {
    const company = await AsyncStorage.getItem('url');
    setVisible(true);
    setLoadingText('Initialization Intouch');

    MapmyIndiaIntouch.initializeWithDeviceId(
      company + '_' + profile.emp_code,
      clientId,
      clientSecret,
      company + '_' + profile.emp_code,
    )
      .then(async res => {
        requestLocationPermission();
        setVisible(false);
      })
      .catch(e => {
        console.log(e);
        setVisible(false);
      });
  };

  async function accountDetails() {
    const profile = await AsyncStorage.getItem('profile');
    setProfile(JSON.parse(profile));
  }

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('always');
        Geolocation.getCurrentPosition(
          position => {
            handlePunchIn(position.coords.latitude, position.coords.longitude);
          },
          error => {
            alert(JSON.stringify(error));
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
          setLoadingText('Getting Current Location');
          Geolocation.getCurrentPosition(
            position => {
              handlePunchIn(
                position.coords.latitude,
                position.coords.longitude,
              );
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

  const handlePunchIn = async (lat, lng) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.punchIn,
        method: 'POST',
        headers: {
          version: '1',
          'x-auth': token,
          'Content-type': 'application/json',
        },
        data: {
          longitude: lat,
          latitude: lng,
        },
      });
      if (response.data.success === true) {
        if (route.params.stack) {
          navigation.navigate('DrawableStack');
        } else {
          navigation.navigate('ActivityStack');
        }
        // MapmyIndiaIntouch.startTracking();
        MapmyIndiaIntouch.startTrackingWithCustomConfig({
          standByTimeInMins: 1, //mandatory
          timeWhileMovingInSec: 10, //mandatory
          enableRequestPermissionIfMissing: true,
        });

        alert(
          'This app collects location data to show your location to your company even when the app is closed or not in use.',
        );
        setVisible(false);
      } else {
        setVisible(false);
        alert('You have already punched in!');
      }
    } catch (error) {
      setVisible(false);
      console.log('catch: ', error);
      Alert.alert('Error', error);
    }
  };

  const punchStatusCard = (title, value, iconName, iconColor) => (
    <Card style={[styles.card, {flex: 1}]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Icon color={iconColor} name={iconName} size={45} />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
          }}>
          <Text style={{fontSize: 14, fontWeight: '600'}}>{title}</Text>
          <Text variant="headlineSmall" style={{fontWeight: '600'}}>
            {value}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.primaryColor}]}>
        <UserView name={profile.name} />

        <View style={styles.inner_container}>
          <Greeting />

          <Card style={[styles.card, {marginTop: 20, padding: 20}]}>
            <View style={styles.cardContainer}>
              {punchStatusCard('Punch In', '10:09', 'clock-in', 'green')}
              {punchStatusCard('Punch Out', '06:00', 'clock-out', 'red')}
            </View>

            <DurationView punchInTime="10:09" />

            <Divider />
            <Divider />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                intouch();
              }}>
              <Text style={{color: 'white', fontSize: 15}}> PUNCH IN </Text>
            </TouchableOpacity>
          </Card>

          {/* <Attendance /> */}

          <LoadingScreen visible={visible} text={LoadingText} />

          <View style={styles.buttonContainer}>
            <View style={styles.buttons_row}>
              <TouchableOpacity
                onPress={() => {
                  if (route.params.stack) {
                    navigation.navigate('DrawableStack');
                  } else {
                    navigation.navigate('ActivityStack');
                  }
                }}>
                <Text style={styles.button_text}>ASK ME LATER</Text>
              </TouchableOpacity>
              <Text
                style={{
                  marginHorizontal: 5,
                  fontSize: 22,
                  color: theme.primaryColorDark,
                }}>
                {' '}
                |{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (route.params.stack) {
                    navigation.navigate('DrawableStack');
                  } else {
                    navigation.navigate('ActivityStack');
                  }
                }}>
                <Text style={styles.button_text}>I AM ON LEAVE</Text>
              </TouchableOpacity>
            </View>

            <Card style={[styles.card, {marginHorizontal: 20, marginVertical: 20}]}>
              <View style={styles.activityLogContainer}>
                <Icon name="alarm" size={30} color={colors.primary} />
                <Text style={{fontSize: 16, fontWeight: '600'}}>
                  Time Log Report
                </Text>
                <TouchableOpacity
                  style={styles.activityButton}>
                  <Icon name="chevron-right" size={25} color={colors.light} />
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inner_container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingHorizontal: 10,
  },

  button: {
    backgroundColor: theme.primaryColorDark,
    paddingVertical: 15,
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 8,
  },

  buttons_row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },

  button_text: {
    fontSize: 16,
    color: theme.primaryColorDark,
    textDecorationLine: 'underline',
  },

  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: 100,
  },

  card: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    padding: 10,
    elevation: 2,
    shadowOpacity: 0.7,
    shadowOffset: {width: -4, height: -4},
    shadowRadius: 10,
    marginHorizontal: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
  },

  cardText: {
    fontWeight: 'bold',
  },

  activityLogContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },

  activityButton: {
    width: 30,
    height: 30,
    backgroundColor: colors.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

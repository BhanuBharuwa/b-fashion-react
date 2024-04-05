import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  TouchableRipple,
  Drawer,
  ActivityIndicator,
} from 'react-native-paper';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {theme} from '../constants/theme';
import {urls} from '../constants/urls';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import MapmyIndiaIntouch from 'mappls-intouch-react-native';
import VersionNumber from 'react-native-version-number';

const index = ({navigation}) => {
  const [status, setStatus] = useState(false);
  const [punch_time, setPunchTime] = useState('');
  const [visible, setVisible] = useState(false);
  const [profile, setProfile] = useState({});
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    accountDetails();
    permissionDetail();
  }, []);

  useEffect(() => {
    if (permissions['punch-in-out-api']) {
      checkPunchStatus();
    }
  });

  async function permissionDetail() {
    const pers = await AsyncStorage.getItem('permission');
    setPermissions(JSON.parse(pers));
  }

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
            punchOut(position.coords.latitude, position.coords.longitude);
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
              punchOut(position.coords.latitude, position.coords.longitude);
            },
            error => {
              alert('Please turn on the Location.');
              setVisible(false);
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

  const checkPunchStatus = async () => {
    try {
      const company = await AsyncStorage.getItem('url');
      const token = await AsyncStorage.getItem('token');
      const response = await axios({
        url: urls.prefix + company + urls.punchStatus,
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
        },
      });
      if (response.data.success === true) {
        setStatus(response.data.data.status);
        if (response.data.data.punch_in_time) {
          setPunchTime(
            moment(response.data.data.punch_in_time).format(
              'D MMM YYYY, h:mm a',
            ),
          );
        } else {
          setPunchTime('');
        }
      } else {
      }
    } catch (error) {
      console.log('drawer contents ', error);
    }
  };

  const onSwictchPressed = () => {
    if (status === false) {
      navigation.navigate('AttendanceScreen', {stack: false});
    } else {
      setVisible(true);
      requestLocationPermission();
    }
  };

  const punchOut = async (lat, lng) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios({
        url: urls.prefix + company + urls.punchOut,
        method: 'POST',
        headers: {
          version: '1',
          'x-auth': token,
          'Content-type': 'application/json',
        },
        data: {
          longitude: lng,
          latitude: lat,
        },
      });

      setVisible(false);
      console.log(response.data);

      if (response.data.success === true) {
        setStatus(false);
        MapmyIndiaIntouch.stopTracking();
        MapmyIndiaIntouch.removeTrackingStateListener();
      } else {
        const {check_out} = response.data.errors;

        if (check_out) {
          Alert.alert('Error', check_out);
          return;
        }

        Alert.alert('Error', JSON.stringify(response.data.errors));
      }
    } catch (error) {
      console.log('catch: ', error);
      Alert.alert('Error', 'Failed to punch out!');
      setVisible(false);
    }
  };
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 0, backgroundColor: theme.primaryColor}} />
      <View style={styles.profileWrapper}>
        <TouchableOpacity style={styles.avatar}>
          <Avatar.Image
            backgroundColor={'white'}
            source={require('../assets/images/profile.png')}
            size={100}
          />
        </TouchableOpacity>
        <Title style={styles.profile_details}> {profile.name} </Title>
        <Caption style={styles.profile_details}> {profile.email} </Caption>
        {permissions['punch-in-out-api'] == true ? (
          <View style={styles.punch_in_out}>
            {visible ? (
              <ActivityIndicator animating={true} color="#fff" size={20} />
            ) : null}
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  marginEnd: 10,
                  marginStart: 5,
                  color: '#fff',
                  fontWeight: 'bold',
                }}>
                Availability Status
              </Text>
              {punch_time == '' ? null : (
                <Text
                  style={{
                    marginEnd: 10,
                    marginStart: 5,
                    color: '#fff',
                    fontWeight: 'bold',
                  }}>
                  {punch_time}
                </Text>
              )}
            </View>
            <TouchableRipple
              onPress={() => {
                onSwictchPressed();
              }}>
              <View pointerEvents="none">
                <Switch style={{marginHorizontal: 5}} value={status} />
              </View>
            </TouchableRipple>
          </View>
        ) : null}
      </View>
      <DrawerContentScrollView>
        <Drawer.Item
          icon={({color, size}) => (
            <Icon name="chart-line" color={color} size={size} />
          )}
          label="Today's report"
          onPress={() => navigation.navigate('ActivityStack')}
        />
        <Drawer.Item
          icon={({color, size}) => (
            <Icon name="poll" color={color} size={size} />
          )}
          label="Team performance"
          onPress={() => navigation.navigate('TeamPerformanceStack')}
        />

        <Drawer.Item
          icon={({color, size}) => (
            <Icon name="store-plus" color={color} size={size} />
          )}
          label="Add new shop"
          onPress={() => navigation.navigate('AddCustomerNavigation')}
        />

        {permissions['list-customers-api'] == true ? (
          <Drawer.Item
            icon={({color, size}) => (
              <Icon name="account-multiple" color={color} size={size} />
            )}
            label="Customers"
            onPress={() => navigation.navigate('CustomersStack')}
          />
        ) : null}

        <Drawer.Item
          icon={({color, size}) => (
            <Icon name="calendar" color={color} size={size} />
          )}
          label="My schedules"
          onPress={() => navigation.navigate('MyScheduleStack')}
        />

        {permissions['list-orders-api'] == true ? (
          <Drawer.Item
            icon={({color, size}) => (
              <Icon name="cart-heart" color={color} size={size} />
            )}
            label="Orders"
            onPress={() => navigation.navigate('OrdersStack')}
          />
        ) : null}

        <Drawer.Item
          icon={({color, size}) => (
            <Icon name="currency-inr" color={color} size={size} />
          )}
          label="Payment"
          onPress={() => navigation.navigate('PaymentStack')}
        />
        <Drawer.Item
          icon={({color, size}) => (
            <Icon name="newspaper" color={color} size={size} />
          )}
          label="News"
          onPress={() => navigation.navigate('NewsStack')}
        />
        <Drawer.Item
          icon={({color, size}) => (
            <Icon name="folder-alert" color={color} size={size} />
          )}
          label="Complaints"
          onPress={() => navigation.navigate('ComplainStack')}
        />
        <Drawer.Item
          icon={({color, size}) => (
            <Icon name="store-cog" color={color} size={size} />
          )}
          label="Competitive Analysis"
          onPress={() => navigation.navigate('CompetitiveAnalysisStack')}
        />
        <Drawer.Item
          icon={({color, size}) => (
            <Icon name="cog" color={color} size={size} />
          )}
          label="Settings"
          onPress={() => navigation.navigate('SettingsStack')}
        />

        <Drawer.Item
          icon={({color, size}) => (
            <Icon name="logout" color={color} size={size} />
          )}
          label="Sign out"
          onPress={() => {
            Alert.alert('', 'Do you want to sign out?', [
              {
                text: 'No',
                onPress: () => {},
              },
              {
                text: 'Yes',
                onPress: () => {
                  AsyncStorage.clear();
                  navigation.navigate('AuthStack');
                  MapmyIndiaIntouch.stopTracking();
                  MapmyIndiaIntouch.removeTrackingStateListener();
                  // navigation.closeDrawer()
                },
              },
            ]);
          }}
        />
        <Text style={{alignSelf: 'center', marginBottom: 10}}>
          Version: {VersionNumber.appVersion} ({VersionNumber.buildVersion})
        </Text>
      </DrawerContentScrollView>
      <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  profileWrapper: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: theme.primaryColor,
  },

  avatar: {
    marginVertical: 5,
  },

  punch_in_out: {
    flexDirection: 'row',
    marginTop: 2,
    alignItems: 'center',
  },

  profile_details: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },

  drawer_item_title: {
    fontSize: 20,
  },
});

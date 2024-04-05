import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MapView, {Marker} from 'react-native-maps';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {theme} from '../../constants/theme';
import {urls} from '../../constants/urls';
import {FAB} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Geocoder.init('AIzaSyAZpUWh4WwNjHYJGuKyTpm4qW3MCaXnrjQ');

const updateLocation = ({route, navigation}) => {
  const {id, customerData} = route.params.data;
  const [location, setLocation] = useState({});

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginRight: 20}}
            onPress={() => {
              fetchCurrentLocation();
            }}>
            <Icon name="navigation" size={25} color={theme.primaryColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (customerData.latitude == '') {
      fetchCurrentLocation();
      Alert.alert('', 'Customer location unavailable. Please update location');
    } else {
      setLocation({
        latitude: customerData.latitude,
        longitude: customerData.longitude,
      });
    }
    console.log(location);
  }, []);
  const updateLocation = () => {
    if (location.latitude && location.longitude) {
      return true;
    }

    return false;
  };
  function showSnackbar(text) {
    Snackbar.show({
      text,
      duration: Snackbar.LENGTH_SHORT,
    });
  }
  const submitUpdate = async () => {
    if (updateLocation()) {
      try {
        const token = await AsyncStorage.getItem('token');
        const company = await AsyncStorage.getItem('url');
        const response = await axios({
          url:
            urls.prefix + company + urls.customers + `/${id}/update-location`,
          method: 'POST',
          headers: {
            'x-auth': token,
            'Content-type': 'application/json',
            version: '1',
          },
          data: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });
        if (response.data.success) {
          showSnackbar('Customer Locations has been succesfully updated.');
          navigation.goBack();
        } else {
          if (response.data.errors.latitude) {
            Alert.alert('Error', response.data.errors.latitude);
            return;
          }
          if (response.data.errors.longitude) {
            Alert.alert('Error', response.data.errors.longitude);
            return;
          }
          Alert.alert('Error', JSON.stringify(response.data.errors));
        }
      } catch (error) {
        console.log('CustomerDetailScreen/submitUpdate: ', error);
        setUpdateLocationVisibility(false);
        Alert.alert('Error', 'Fail to update location');
      }
    } else {
      showSnackbar('Failed to update location!');
    }
  };

  const fetchCurrentLocation = async () => {
    try {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('always');
        Geolocation.getCurrentPosition(
          position => {
            setLocation(position.coords);
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
              setLocation(position.coords);
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
  return (
    <View style={styles.container}>
      {location.latitude == null ? null : (
        <MapView
          style={{height: '100%', width: '100%'}}
          showsMyLocationButton={true}
          Camera={{
            center: {
              latitude: parseFloat(location.longitude),
              longitude: parseFloat(location.longitude),
            },
          }}
          followsUserLocation
          zoomEnabled={true}
          onPress={e => console.log(e)}
          initialRegion={{
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0021,
          }}>
          <Marker.Animated
            draggable
            followsUserLocation
            coordinate={{
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            }}
            onDragEnd={e => setLocation(e.nativeEvent.coordinate)}
          />
        </MapView>
      )}
      <FAB
        style={styles.fab}
        medium
        color="white"
        icon="map-marker-circle"
        onPress={() => submitUpdate()}
        label="Update Location"
      />
    </View>
  );
};

export default updateLocation;

const styles = StyleSheet.create({
  container: {
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

  fab: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.primaryColor,
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

import React, {memo, useEffect, useRef} from 'react';
import {Alert, Linking, ScrollView, StyleSheet, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {HelperText, TextInput} from 'react-native-paper';
import {
  fetchCurrentLocation,
  requestGeolocationPermission,
} from '../../utils/location_permission';
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyAZpUWh4WwNjHYJGuKyTpm4qW3MCaXnrjQ');

const OuletLocationForm = ({values, errors, setFieldValue}) => {
  const ref = useRef();

  const askLocation = async () => {
    try {
      console.log(values.latitude.toString(), values.longitude.toString());

      if (values.latitude && values.longitude) {
        ref.current?.animateToRegion(
          {
            longitude: parseFloat(values.longitude),
            latitude: parseFloat(values.latitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1500,
        );
        return;
      }

      const status = await requestGeolocationPermission();

      if (status === 'granted' || status === 'limited') {
        const pos = await fetchCurrentLocation();

        ref.current?.animateToRegion(
          {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1500,
        );
      } else {
        Alert.alert(
          'Access denied',
          'Location permission needs to be granted to access your location',
          [
            {
              text: 'Cancel',
            },
            {
              text: 'Go to settings',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }
    } catch (err) {
      Alert.alert('Location Permission Error', JSON.stringify(err));
    }
  };

  const onMapPress = event => {
    setFieldValue('latitude', event.nativeEvent.coordinate.latitude);
    setFieldValue('longitude', event.nativeEvent.coordinate.longitude);

    Geocoder.from(
      event.nativeEvent.coordinate.latitude,
      event.nativeEvent.coordinate.longitude,
    )
      .then(json => {
        setFieldValue('address', json.results[0].formatted_address);
      })
      .catch(err => {
        Alert.alert('Address Geocoder error', JSON.stringify(err));
      });
  };

  useEffect(() => {
    askLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={ref}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        zoomControlEnabled
        onPress={onMapPress}>
        {values.latitude.toString().length > 0 &&
          values.longitude.toString().length > 0 && (
            <Marker
              coordinate={{
                latitude: values.latitude,
                longitude: values.longitude,
              }}
            />
          )}
      </MapView>
      <ScrollView
        style={styles.fieldContainer}
        showsVerticalScrollIndicator={false}>
        {(errors.latitude || errors.longitude || errors.address) && (
          <HelperText type="error">
            Location needs to selected from map
          </HelperText>
        )}
        <TextInput
          style={styles.input}
          label="Latitude, Longitude"
          editable={false}
          value={`${
            values.latitude.toString().length > 0
              ? values.latitude.toFixed(5)
              : ''
          },${
            values.longitude.toString().length > 0
              ? values.longitude.toFixed(5)
              : ''
          }`}
        />
        <TextInput
          style={styles.input}
          label="Address"
          editable={false}
          value={values.address}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 2,
  },
  fieldContainer: {
    marginVertical: 10,
    flex: 1,
  },
  input: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
});

export default memo(OuletLocationForm);

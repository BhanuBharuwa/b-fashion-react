import {Platform} from 'react-native';
import Geolocation, {GeoError} from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';

export const requestGeolocationPermission = () => {
  return request(
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  );
};
/**
 *
 * @returns {Promise<Geolocation.GeoPosition>}
 */
export const fetchCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position);
      },
      error => {
        reject(error);
      },
    );
  });
};

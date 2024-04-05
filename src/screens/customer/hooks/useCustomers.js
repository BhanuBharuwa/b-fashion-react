import {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {urls} from '../../../constants/urls';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';

const useCustomers = () => {
  const [checkInCustomer, setCheckInCustomer] = useState({});
  const [todayCustomerData, setTodayCustomer] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  const {navigation} = useNavigation();

  const customerVisitStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.customerVisitStatus,
        method: 'GET',
        headers: {
          'x-auth': token,
          version: '1',
          'Content-type': 'application/json',
        },
      });

      if (response.data.success === true) {
        setCheckInCustomer(response.data.data);
      } else {
        console.log('failed', response.data);
      }
    } catch (error) {
      console.log('catch: ', error);
      Alert.alert('Error', error);
    }
  };

  const getTodaysCustomerList = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.customers + '/today',
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
        },
      });
      if (response.data.success === true) {
        setTodayCustomer(response.data.data.customers);
      } else {
        if (response.data.errors.token === 'token_invalid') {
          AsyncStorage.clear();
          navigation.navigate('AuthStack');
          navigation.closeDrawer();
          Alert.alert('Error', 'Login form another devices');
        }
      }
    } catch (error) {
      console.log('Catch/getCustomerList: ', error);
      Alert.alert('Error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    todayCustomerData,
    isLoading,
    getTodaysCustomerList,
  };
};

export default useCustomers;

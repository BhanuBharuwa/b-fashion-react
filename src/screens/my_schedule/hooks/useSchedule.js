import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import moment from 'moment';
import {useState} from 'react';
import {Alert} from 'react-native';
import {urls} from '../../../constants/urls';
import {useNavigation, StackActions} from '@react-navigation/native';

const useSchedule = () => {
  const {goBack, dispatch} = useNavigation();

  const [loading, setLoading] = useState(false);
  const [areaScehdules, setAreaSchedules] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [areas, setAreas] = useState([]);
  const [errors, setErrors] = useState({});
  const [scheduleDetail, setSchdeuleDetail] = useState({});

  const fetchAreas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios.get(urls.prefix + company + urls.areas, {
        headers: {
          'x-auth': token,
          version: '1',
          Accept: 'application/json',
        },
      });

      const {success, data, errors} = response.data;

      if (success) {
        setAreas(data.areas);
      } else {
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (err) {
      Alert.alert('Error', JSON.stringify(err));
    }
  };

  const fetchAreaSchedules = async (page, startDate, endDate) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios.get(
        urls.prefix + company + urls.areaSchedules,
        {
          headers: {
            'x-auth': token,
            version: '1',
            Accept: 'application/json',
          },
          params: {
            start_date: moment(startDate).format('YYYY-MM-DD'),
            end_date: moment(endDate).format('YYYY-MM-DD'),
            page,
          },
        },
      );

      setLoading(false);
      const {success, data, errors} = response.data;

      if (success) {
        if (page === 1) {
          setAreaSchedules(data.area_schedules);
        } else {
          setAreaSchedules(areaScehdules.concat(data.area_schedules));
        }
        setHasMore(data.has_more);
      } else {
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', JSON.stringify(err));
    }
  };

  const submitAreaSchedule = async (area_id, date, remarks) => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios.post(
        urls.prefix + company + urls.areaSchedules,
        {area_id, date, remarks},
        {
          headers: {
            'x-auth': token,
            version: '1',
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
        },
      );

      setLoading(false);
      const {success, errors} = response.data;

      if (success) {
        Alert.alert('Success', 'New area schedule has been added');
        goBack();
      } else {
        setErrors(errors);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', JSON.stringify(err));
    }
  };

  const fetchScheduleDetail = async id => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios.get(
        urls.prefix + company + urls.areaSchedules + `/${id}`,
        {
          headers: {
            'x-auth': token,
            version: '1',
            Accept: 'application/json',
          },
        },
      );

      const {success, data, errors} = response.data;

      if (success) {
        setSchdeuleDetail(data);
      } else {
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (err) {
      Alert.alert('Error', JSON.stringify(err));
    }
  };

  const updateAreaSchedule = async (area_id, date, remarks, id) => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios.post(
        urls.prefix + company + urls.areaSchedules + `/${id}`,
        {area_id, date, remarks, _method: 'PUT'},
        {
          headers: {
            'x-auth': token,
            version: '1',
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
        },
      );

      setLoading(false);
      const {success, errors} = response.data;

      if (success) {
        Alert.alert('Success', 'Area schedule has been updated');
        dispatch(StackActions.pop(2));
      } else {
        if (errors.id) {
          Alert.alert('Error', errors.id);
          return;
        }

        setErrors(errors);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', JSON.stringify(err));
    }
  };

  const deleteAreaSchedule = async id => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios.post(
        urls.prefix + company + urls.areaSchedules + `/${id}`,
        {_method: 'DELETE'},
        {
          headers: {
            'x-auth': token,
            version: '1',
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
        },
      );

      setLoading(false);
      const {success, errors} = response.data;

      if (success) {
        Alert.alert('Success', 'Area schedule has been deleted.');
        goBack();
      } else {
        if (errors.id) {
          Alert.alert('Error', errors.id);
          return;
        }
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', JSON.stringify(err));
    }
  };

  return {
    areaScehdules,
    loading,
    hasMore,
    areas,
    errors,
    scheduleDetail,
    fetchScheduleDetail,
    fetchAreas,
    fetchAreaSchedules,
    submitAreaSchedule,
    updateAreaSchedule,
    deleteAreaSchedule,
  };
};

export default useSchedule;

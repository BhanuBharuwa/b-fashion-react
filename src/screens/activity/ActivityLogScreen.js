import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {theme} from '../../constants/theme';
import {urls} from '../../constants/urls';
import {useFocusEffect} from '@react-navigation/native';

const ActivityLogScreen = ({}) => {
  const [logData, setLogData] = useState([]);
  const [date, setDate] = useState(moment());

  useEffect(() => getActivityLog(), [date]);

  const getActivityLog = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios({
        url: urls.prefix + company + urls.activityLog,
        method: 'GET',

        headers: {
          'x-auth': token,
          version: '1',
          'Content-type': 'application/json',
          Accept: 'application/json',
        },
        params: {
          date: moment(new Date()).format('YYYY-MM-DD'),
        },
      });

      const {success, data} = response.data;

      if (success) {
        setLogData(data.activity_logs);
      }
    } catch (err) {
      console.log('errr', err?.response);
    }
  };
  return <View style={styles.container}></View>;
};

export default ActivityLogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  button: {
    backgroundColor: theme.primaryColorDark,
    paddingVertical: 10,
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  shareBtton: {
    color: '#000',
    marginLeft: 20,
    marginRight: 20,
    // fontWeight: "bold",
    fontSize: 14,
    paddingBottom: 5,
  },
  list_item: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
  },
  vender: {
    flexDirection: 'row',
    marginStart: 20,
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

  checkbox: {
    position: 'absolute',
    right: 20,
  },
});

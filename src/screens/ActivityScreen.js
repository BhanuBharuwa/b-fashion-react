import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import {Caption, Divider, Subheading, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ItemRow from '../components/ItemRow';
import {colors} from '../constants/theme';
import {urls} from '../constants/urls';

const size = 23;

const ActivityScreen = ({navigation}) => {
  const [logData,setLogData] = useState([])
  const [performance, setPerformance] = useState({
    customer_count: null,
    first_check_in_time: null,
    last_check_in_time: null,
    order_count: null,
    productive_count: null,
    productive_percentage: null,
    total_amount: null,
    visit_count: null,
  });
  const getDailyPerformance = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');

      const response = await axios({
        url: urls.prefix + company + urls.dailyPerformance,
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
        setPerformance(data);
      }
    } catch (err) {
      console.log('errr', err?.response);
    }
  };

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

  useFocusEffect(
    useCallback(() => {
      getDailyPerformance();
      getActivityLog()
    }, []),
  );

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit!', 'Are you sure you want to exit app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl onRefresh={getDailyPerformance} refreshing={false} />
      }>
      <View style={styles.card}>
        <Subheading style={styles.tite}>Check in Information</Subheading>
        <Divider />
        <Divider />
        <View style={styles.row}>
          <View style={[styles.iconView, {backgroundColor: 'green'}]}>
            <Icon name="clock" color="white" size={size} />
          </View>
          <Text style={styles.text}>First check in: </Text>
          <Text style={styles.text2}>
            {performance?.first_check_in_time
              ? performance?.first_check_in_time
              : 'N/A'}
          </Text>
        </View>
        <View style={styles.row}>
          <View style={[styles.iconView, {backgroundColor: 'red'}]}>
            <Icon name="clock" color="white" size={size} />
          </View>

          <Text style={styles.text}>Last check in: </Text>
          <Text style={styles.text2}>
            {performance?.last_check_in_time
              ? performance?.last_check_in_time
              : 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Subheading style={styles.tite}>Performance summary</Subheading>
        <Divider />
        <Divider />
        <ItemRow
          backGroundColor={colors.primary}
          iconName="storefront"
          label="Total customers"
          value={performance?.customer_count}
        />
        <ItemRow
          backGroundColor="#035598"
          iconName="store-marker"
          label="Total visits"
          value={performance?.visit_count}
        />
        <ItemRow
          backGroundColor={colors.accentPrimary}
          iconName="cart"
          label="Total orders"
          value={performance?.order_count}
        />
        <ItemRow
          backGroundColor="green"
          iconName="cash-register"
          label="Total amount"
          value={performance?.total_amount}
        />
        <Subheading style={styles.tite}>Productivity summary</Subheading>
        <Divider />
        <Divider />
        <ItemRow
          backGroundColor={colors.accentPrimary}
          iconName="chart-line"
          label="Total productivity"
          value={performance?.productive_count}
        />
        <ItemRow
          backGroundColor="green"
          iconName="percent"
          label="Percentage"
          value={performance?.productive_percentage}
        />
          
        <Divider />
      </View>
      <View style={[styles.card,{marginBottom:30}]}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
      <Subheading style={styles.tite}>Activity Logs</Subheading>
      {/* <Text onPress={()=>navigation.navigate('ActivityLog')}>View More>> </Text> */}
      </View>
           <Divider />

           {logData.map(data=>(
            <View key={data._id}>
            <Text>{data.text}</Text>
            <Caption>{data.created_at}</Caption>
            <Divider />
            </View>
           ))}
      </View>
      {/* <TouchableHighlight>
        <View style={styles.button}>
          <Text style={styles.buttonText}>See Daily Performance</Text>
          <Icon name="chevron-right-circle" size={size} color={colors.light} />
        </View>
      </TouchableHighlight> */}
    </ScrollView>
  );
};

export default ActivityScreen;
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
  },
  card: {
    marginVertical: 10,
    elevation: 3,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    marginHorizontal: 2,
  },
  tite: {
    marginVertical: 5,
    fontWeight: '600',
  },
  row: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 10,
  },
  text2: {
    fontWeight: 'bold',
  },
  iconView: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    borderRadius: 5,
  },
  button: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

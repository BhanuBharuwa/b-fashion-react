import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {FAB} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {theme} from '../constants/theme';
import {urls} from '../constants/urls';
import Divider from '../components/Divider';

const PaymentScreen = ({navigation}) => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    fetchAllPayments();
    permissionDetail();
  }, []);

  async function permissionDetail() {
    const pers = await AsyncStorage.getItem('permission');
    setPermissions(JSON.parse(pers));
  }

  const fetchAllPayments = async () => {
    setIsLoading(true);
    try {
      const company = await AsyncStorage.getItem('url');
      const token = await AsyncStorage.getItem('token');
      const response = await axios({
        url: urls.prefix + company + urls.payment,
        method: 'GET',
        headers: {
          'x-auth': token,
          version: '1',
          'Content-type': 'application/json',
        },
      });

      if (response.data.success === true) {
        setPayments(response.data.data.payments);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.log('failed', response.data);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('catch: ', error);
      Alert.alert('Error', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{backgroundColor: '#fff'}}
        data={payments}
        keyExtractor={item => item._id}
        refreshing={isLoading}
        onRefresh={() => fetchAllPayments()}
        renderItem={({item, key}) => {
          let statusColor =
            item.status === 'pending'
              ? 'orange'
              : item.status === 'confirmed'
              ? 'green'
              : 'red';

          return (
            <View>
              <TouchableOpacity
                key={item.key}
                onPress={() => {
                  navigation.navigate('PaymentDetailScreen', {data: item});
                }}
                style={styles.activity_item}>
                <View style={{width: '20%'}}>
                  <Icon
                    style={styles.icon}
                    name="cash"
                    size={40}
                    color={statusColor}
                  />
                </View>
                <View style={{width: '80%'}}>
                  <View style={styles.vender}>
                    <Text style={styles.title}>#{item.payment_number}</Text>
                    <Text style={{color: statusColor, marginStart: 5}}>
                      [{item.status}]
                    </Text>
                  </View>
                  <View style={styles.vender}>
                    <Icon name="timetable" size={20} color={'gray'} />
                    <Text style={styles.created_at}>{item.created_at}</Text>
                  </View>
                  <View style={styles.vender}>
                    <Icon name="contacts-outline" size={20} color="gray" />
                    <Text style={styles.vender_name}>{item.customer_name}</Text>
                  </View>
                </View>
                <View style={styles.checkbox}>
                  <Text style={styles.currency}>₹ {item.amount}</Text>
                </View>
              </TouchableOpacity>
              <Divider />
            </View>
          );
        }}
      />
      <View style={styles.list_item}></View>
      {permissions['add-payment-api'] == true ? (
        <FAB
          style={styles.fab}
          medium
          color="white"
          icon="plus"
          onPress={() => navigation.navigate('CustomersStack')}
        />
      ) : null}
    </View>
  );
};

export default PaymentScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  vender_name: {
    marginHorizontal: 5,
    fontWeight: 'bold',
  },
  created_at: {
    marginStart: 5,
  },
  list_item: {
    flex: 1,
    backgroundColor: 'white',
  },
  vender: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
  },
  activity_item: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginVertical: 6,
  },
  icon: {
    marginHorizontal: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkbox: {
    position: 'absolute',
    right: 20,
    top: 0,
  },
  currency: {
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'flex-end',
  },
  fab: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.primaryColor,
  },
});

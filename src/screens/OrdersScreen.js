import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {FAB} from 'react-native-paper';
import {theme} from '../constants/theme';
import {useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {urls} from '../constants/urls';
import Divider from '../components/Divider';
import EmptyCustomer from '../svg/EmptyCustomer';
import {set} from 'react-native-reanimated';

const OrdersScreen = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState({});

  var code = 'BFC';
  var count = 0;

  useEffect(() => {
    getOrders();
    permissionDetail();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getOrders();
    }, []),
  );
  async function permissionDetail() {
    const pers = await AsyncStorage.getItem('permission');
    setPermissions(JSON.parse(pers));
  }
  const renderEmptyView = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}>
        <EmptyCustomer />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 15,
            color: 'gray',
          }}>
          Order Unavailable!
        </Text>
      </View>
    );
  };
  const getOrders = async () => {
    setIsLoading(true);
    try {
      const company = await AsyncStorage.getItem('url');
      const token = await AsyncStorage.getItem('token');
      const response = await axios({
        url: urls.prefix + company + urls.order,
        method: 'GET',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
      });

      if (response.data.success === true) {
        setOrders(response.data.data.orders);
        setIsLoading(false);
      } else {
        if (response.data.errors.token === 'token_invalid') {
          AsyncStorage.clear();
          navigation.navigate('AuthStack');
          navigation.closeDrawer();
          Alert.alert('Error', 'Login form another devices');
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log('OrdersScreen/GetOrders: ', error);
      Alert.alert('Error', error);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        ListEmptyComponent={renderEmptyView()}
        keyExtractor={item => item._id}
        refreshing={isLoading}
        onRefresh={() => getOrders()}
        renderItem={({item, index}) => {
          let statusColor =
            item.status === 'open'
              ? 'green'
              : item.status === 'closed'
              ? 'black'
              : item.status === 'pending'
              ? 'orange'
              : 'red';
          return (
            <View key={item.key}>
              <TouchableOpacity
                onPress={() => {
                  permissions['view-order-api'] == true
                    ? navigation.navigate('OrderDetailScreen', {
                        id: item._id,
                        order_num: item.order_number,
                      })
                    : null;
                }}
                style={styles.activity_item}>
                <View style={{width: '20%'}}>
                  <Icon
                    style={styles.icon}
                    name="clipboard-multiple-outline"
                    size={40}
                    color={statusColor}
                  />
                </View>
                <View style={{width: '60%'}}>
                  <View style={styles.vender}>
                    <Text style={styles.title}>#{item.order_number} </Text>
                    <Text style={{color: statusColor, marginStart: 5}}>
                      [{item.status.toUpperCase()}]
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
                <View style={{width: '20%'}}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: theme.primaryColorDark,
                      fontWeight: 'bold',
                    }}>
                    ₹ {item.total_amount}
                  </Text>
                </View>
              </TouchableOpacity>
              <Divider />
            </View>
          );
        }}
      />
      {permissions['add-order-api'] == true ? (
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

export default OrdersScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  vender_name: {
    marginStart: 5,
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
    marginTop: 4,
    alignItems: 'center',
  },
  activity_item: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginVertical: 6,
    alignItems: 'center',
  },
  icon: {
    marginStart: 10,
    marginEnd: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkbox: {
    position: 'absolute',
    right: 20,
  },
  currency: {
    color: theme.primaryColor,
    fontWeight: '100',
    fontSize: 16,
  },

  fab: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.primaryColor,
  },
});

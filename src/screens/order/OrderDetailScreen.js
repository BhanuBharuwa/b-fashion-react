import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import ListItem from '../../components/ListItem';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {theme} from '../../constants/theme';

import {urls} from '../../constants/urls';
import Divider from '../../components/Divider';

const initialLayout = {width: Dimensions.get('window').width};
const OrderDetailScreen = ({route}) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'DETAIL'},
    // { key: 'second', title: 'ACTIVITY' },
  ]);

  const [orderDetails, setOrderDetails] = useState({});
  const [products, setProducts] = useState([]);

  const {id, order_num} = route.params;

  var total = 0;

  useEffect(() => {
    getOrderDetails();
  }, []);

  const getOrderDetails = async () => {
    try {
      const company = await AsyncStorage.getItem('url');
      const token = await AsyncStorage.getItem('token');
      const response = await axios({
        url: urls.prefix + company + urls.order + '/' + id,
        method: 'GET',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
      });

      if (response.data.success === true) {
        console.log(response.data.data.products);

        setOrderDetails(response.data.data);
        setProducts(response.data.data.products);
      } else {
        console.log('OrdersScreen/GetOrders:', response.data);
      }
    } catch (error) {
      console.log('OrdersScreen/GetOrders: ', error);
      Alert.alert('Error', error);
    }
  };

  const FirstRoute = () => (
    <ScrollView style={styles.list_item}>
      <ListItem title="Order No." value={`#${order_num}`} />
      <ListItem title="Order Date" value={orderDetails.created_at} />
      <ListItem title="Customer Name" value={orderDetails.customer} />
      <View style={{paddingStart: 20, marginVertical: 20}}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              fontWeight: '600',
              color: '#333',
              fontSize: 16,
              marginHorizontal: 10,
              color: theme.primaryColor,
              fontFamily: 'Karla-Bold',
            }}>
            PRODUCTS DETAIL
          </Text>
          <Divider />
        </View>
      </View>
      {products.map((product, index) => {
        total = product.amount + total;
        return (
          <View style={{marginHorizontal: 10}} key={index}>
            {/* <ListItem title="Product" value={product.name} />
                            <ListItem title="Sub-total" value={`${product.quantity} * ${product.rate} \n=${product.amount}`} />
                            <Divider /> */}
            <View style={styles.activity_item}>
              <View style={{width: '20%'}}>
                {product.photo_url && (
                  <Image
                    resizeMode="contain"
                    style={{
                      height: 70,
                      width: 70,
                      marginRight: 10,
                      borderWidth: 1,
                      marginTop: 0,
                    }}
                    source={{uri: product.photo_url}}
                  />
                )}
              </View>
              <View style={{width: '80%', paddingLeft: 10}}>
                <Text style={styles.title}>{product.name} </Text>
                <View style={styles.price}>
                  <View style={{width: '50%', flexDirection: 'row'}}>
                    <Text style={[styles.producttext]}>{product.quantity}</Text>
                    <Text style={[styles.product_unit, {color: '#636e72'}]}>
                      {' '}
                      {product?.unit_name}{' '}
                      {`(${product?.unit_piece_count} per unit)`}
                    </Text>
                    <Text
                      style={[
                        styles.product_unit,
                        {color: theme.primaryColor},
                      ]}>
                      {' '}
                      x{' '}
                    </Text>
                    <Text style={[styles.producttext]}> ₹ {product.rate} </Text>
                  </View>
                  <View
                    style={{
                      width: '50%',
                      alignItems: 'flex-end',
                      paddingRight: 20,
                      fontFamily: 'Karla-Bold',
                    }}>
                    <Text
                      style={[
                        styles.producttext,
                        {
                          fontWeight: '400',
                          marginTop: 5,
                          fontSize: 17,
                          color: theme.primaryColor,
                          justifyContent: 'flex-end',
                        },
                      ]}>
                      ₹ {product.amount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <Divider />
          </View>
        );
      })}
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'flex-end',
          paddingHorizontal: 30,
        }}>
        <Text style={{fontSize: 18, fontFamily: 'Karla-Bold'}}>
          Grand Total :{' '}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: theme.primaryColor,
            fontFamily: 'Karla-Bold',
          }}>
          ₹ {total.toFixed(2)}
        </Text>
      </View>
      {/* <ListItem title="Grand Total" value={total} /> */}
    </ScrollView>
  );

  const SecondRoute = () => (
    <View style={styles.list_item}>
      <View style={styles.list_item}>
        <View style={styles.activity_item}>
          <View>
            <View style={styles.vender}>
              <Text>Payment Collection </Text>
              <Text style={styles.title}> 010 Confirm</Text>
            </View>
            <Text style={styles.text_date}>Ram on 18 Dec,2020 10:36 AM</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  return (
    <View style={styles.container}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
    </View>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  product_unit: {
    marginTop: 7,
    fontFamily: 'Karla-Bold',
  },
  activity_item: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 6,
    flex: 1,
  },
  price: {
    flexDirection: 'row',
    width: '100%',
  },
  producttext: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Karla-Bold',
  },
  list_item: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    color: '#2d3436',
    fontSize: 16,
    fontFamily: 'Karla-Bold',
  },
  vender: {
    flexDirection: 'row',
    marginStart: 20,
  },
  activity_item: {
    flexDirection: 'row',
    paddingBottom: 0,
    marginVertical: 6,
    alignItems: 'center',
  },
  text_date: {
    marginStart: 20,
  },

  checkbox: {
    position: 'absolute',
    right: 20,
  },
});

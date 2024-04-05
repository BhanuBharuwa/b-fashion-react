import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
 
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Button, Card, FAB ,Text} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import { theme } from '../../constants/theme';
import { urls } from '../../constants/urls';
import { OrientationLocker, PORTRAIT } from "react-native-orientation-locker";
import { useSelector } from 'react-redux';

const CartScreen = ({ route, navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [customerNme, setCustomerName] = useState('');
  const [profile, setProfile] = useState({});
  const [remarks, setRemarks] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { carts } = useSelector(state => state.cart)
  const { backto } = route.params;
  var grandTotal = 0;

  useEffect(() => {
    getCartItem();
    setCartItems(convertToExpectedData());
    accountDetails();

    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  function convertToExpectedData() {
    const groupedById = {};

    carts.forEach(item => {
      const itemId = item.i_d;

      if (!groupedById[itemId]) {
        groupedById[itemId] = {
          _id: item._id,
          name: item.name,
          parent_product: item.parent_product,
          parent_product_id: item.parent_product_id,
          variants: []
        };
      }

      groupedById[itemId].variants.push({
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        unit: item.unit
      });
    });
    return Object.values(groupedById);
  }

  const getCartItem = async () => {
    const name = await AsyncStorage.getItem('customer_name');
    setCustomerName(name);
  };

  const placeOrder = async () => {
    if (carts !== null) {
      if (carts.length > 0) {
        try {
          const token = await AsyncStorage.getItem('token');
          const company = await AsyncStorage.getItem('url');
          const response = await axios({
            url: urls.prefix + company + urls.order,
            method: 'POST',
            headers: {
              'x-auth': token,
              'Content-type': 'application/json',
              version: '1',
            },
            data: {
              products: JSON.stringify(carts),
              remarks: remarks,
            },
          });

          if (response.data.success === true) {
            await AsyncStorage.setItem('carts', JSON.stringify([]));
            Alert.alert(
              'Success',
              'Your order has been placed.',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    navigation.pop(backto);
                  },
                },
                // {
                //   text: 'YES',
                //   onPress: () => {
                //     sendSms(response.data.data.order_number);
                //     navigation.pop(backto);
                //   },
                // },
              ],
            );
          } else {
            Snackbar.show({
              text: 'Please kindly check your item units again',
            });
          }
        } catch (error) {
          console.log('Catch/placeOrder: ', error);
          Alert.alert('Error', error);
        }
      } else {
        alert('No items in the cart!');
      }
    } else {
      alert('No items in the cart!');
    }
  };
  async function accountDetails() {
    const profile = await AsyncStorage.getItem('profile');
    setProfile(JSON.parse(profile));
  }

  const sendSms = async order_number => {
    let cart = '';
    let total = 0;
    const phone = await AsyncStorage.getItem('customer_mobile');
    cartItems.map(item => {
      cart = cart.concat(item.name + ' * ' + item.quantity, '\n');
      total =
        total +
        item.quantity * item.price
    });

    let body =
      'PASSI FROZEN FOODS' +
      '\nDate: ' +
      moment().format('DD-MM-YYYY') +
      '\nOrder placed by ' +
      profile.name +
      '\nOrder number: ' +
      order_number +
      '\n' +
      cart +
      'Total: ₹' +
      total.toFixed(2);
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = 'sms:' + phone + separator + 'body=' + body;
    await Linking.openURL(url);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <OrientationLocker orientation={PORTRAIT} />
        {/* <Card
          style={{
            padding: 20,
            backgroundColor: '#fff',
            marginBottom: 10,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1}}>
              <Text style={styles.text_title}>Customer Name</Text>
              <Text style={[styles.text_body, {marginBottom: 4}]}>
                {customerNme}
              </Text>
              <Text style={styles.text_title}>Order Date</Text>
              <Text style={styles.text_body}>
                {moment().format('YYYY/MM/DD')}
              </Text>
            </View>
            <Image
              source={require('../../assets/images/Cart.png')}
              style={{alignSelf: 'center'}}
              resizeMode="contain"
            />
          </View>
        </Card> */}
        {
          cartItems.map((cart) => {
            var total=0
            var units=0
            cart.variants.map((product, key) => {
              units = units +product.quantity
              total =
                product.quantity * product?.price +
                total;
            })
            grandTotal = grandTotal + total
            return (
              <View style={{flex:1}}>
                <View style={{padding:10}}>
                  <Text>Distributor</Text>
                  <Text style={{color:'#000',fontWeight:'700',marginLeft:10}}>DEMO Distributor- 1</Text>
                </View>
                <View style={styles.category_container}>
                  <View>
                    <Text style={{color:'#8b5b8f',fontWeight:'700'}}>{cart.parent_product}</Text>
                    <Text>{units} Units</Text>
                  </View>
                  <Text>₹ {total}</Text>
                </View>
                {
                  cart.variants.map(variant => (
                    <View style={{padding:10}}>
                      <Text style={{color:'#000',fontWeight:'bold'}}>{cart.name + " - "+ variant.size}</Text>
                      <View  style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}}>
                        <Text>PTR</Text>
                        <Text>{variant.price}</Text>
                        <Text>X</Text>
                        <Text style={{backgroundColor:'#e5f8ff',paddingHorizontal:20,paddingVertical:5,borderRadius:10}}>{variant.quantity} {variant.unit}</Text>
                        <Text>=</Text>
                        <Text>₹ {variant.quantity * variant.price}</Text>
                      </View>
                    </View>
                  ))
                }
              </View>
            )
          })
        }
        <View style={{backgroundColor:'#f9c345',padding:10,marginHorizontal:10,alignItems:'center'}}>
          <Text style={{fontWeight:'700'}}>ORDER SUMMARY</Text>
        </View>
        <View style={styles.footer_container}>
          <Text>SUB-TOTAL</Text>
          <Text>₹ {grandTotal}</Text>
        </View>
        <View style={styles.footer_container}>
            <Text>TOTAL</Text>
            <Text>₹ {grandTotal}</Text>
        </View>
        <View style={styles.footer_container}>
          <Text>NET AMOUNT</Text>
          <Text>₹ {grandTotal}</Text>
        </View>

        {/* <Card style={styles.product_card}>
          <Text
            style={{
              fontWeight: '600',
              color: '#333',
              fontSize: 16,
              marginHorizontal: 10,
              color: theme.primaryColor,
              fontFamily: 'Karla-Bold',
              marginBottom: 6,
            }}>
            {carts === null || carts.length < 1
              ? ''
              : 'PRODUCTS DETAIL'}
          </Text>
          <View>
            {carts !== null && carts.length > 0 ? (
              carts.map((product, key) => {
                grandTotal =
                  product.quantity * product?.price +
                  grandTotal;
                return (
                  <Card
                    key={key}
                    style={{
                      marginHorizontal: 10,
                      marginBottom: 12,
                      marginTop: 2,
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      backgroundColor: '#fff',
                    }}>
                    <View style={styles.activity_item}>
                      {product.image && (
                        <Image
                          resizeMode="contain"
                          style={{
                            height: 50,
                            width: 50,
                            marginHorizontal: 5,
                            borderRadius: 5,
                            borderWidth: 1,
                            marginTop: 0,
                          }}
                          source={{uri: product.image}}
                        />
                      )}
                      <View style={{marginLeft: 8, flex: 1}}>
                        <Text style={styles.title} numberOfLines={1}>
                          {product.name} ({product.size})
                        </Text>
                        <View style={styles.price}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={[styles.producttext]}>
                              {product.quantity}
                            </Text>
                            <Text
                              style={[styles.product_unit, {color: '#636e72'}]}>
                              {' '}
                              {`${product?.unit}`}{' '}
                            </Text>
                            <Text
                              style={[
                                styles.product_unit,
                                {color: theme.primaryColor},
                              ]}>
                              {' '}
                              x{' '}
                            </Text>
                            <Text style={[styles.producttext]}>
                              {' '}
                              ₹ {product?.price}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            alignItems: 'flex-end',
                            marginRight: 10,
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
                                marginLeft: 10,
                              },
                            ]}>
                            ₹{' '}
                            {(
                              product.quantity *
                              product.price 
                            ).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                );
              })
            ) : (
              <Text
                style={{paddingStart: 20, fontSize: 16, alignSelf: 'center'}}>
                Your cart is empty!
              </Text>
            )}

            {carts === null || carts.length < 1 ? null : (
              <View
                style={{
                  flexDirection: 'row',
                  // width: '100%',
                  justifyContent: 'flex-end',
                  paddingHorizontal: 15,
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
                  ₹ {grandTotal.toFixed(2)}
                </Text>
              </View>
            )}
            <TextInput
              style={styles.input_text}
              multiline={true}
              onChangeText={val => {
                setRemarks(val);
              }}
              placeholder="Remark (optional)"
            />
          </View>
        </Card> */}
      </ScrollView>
      {!keyboardVisible && (
        // <FAB
        //   style={styles.fab}
        //   medium
        //   color="white"
        //   onPress={() => placeOrder()}
        //   label="Place Order"
        // />
        <Button mode='contained' style={{borderRadius:0,margin:10}} onPress={() => placeOrder()}>
          Order Confirmation
        </Button>
      )}
    </>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  fab: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.primaryColor,
  },
  footer_container: { 
    justifyContent: 'space-between', 
    padding:10,
    flexDirection: 'row',
    flex:1
  },
  category_container: { 
    justifyContent: 'space-between',
   flexDirection: 'row', 
   alignItems: 'center', 
   backgroundColor: '#dee9ef', 
   padding: 10 
  },
  container: {
    backgroundColor: '#f0f0f0',
    // padding: 10,
  },
  product_card: {
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  product_unit: {
    marginTop: 7,
    fontFamily: 'Karla-Bold',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'Karla-Bold',
  },
  vender: {
    flexDirection: 'row',
    marginStart: 20,
  },
  activity_item: {
    flexDirection: 'row',
  },
  text_date: {
    marginStart: 20,
  },

  checkbox: {
    position: 'absolute',
    right: 20,
  },
  text_title: {
    color: theme.primaryColor,
    fontFamily: 'Karla-Bold',
    fontSize: 14,
  },
  input_text: {
    borderColor: theme.primaryColorDark,
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  text_body: {
    fontFamily: 'Karla-Regular',
    fontSize: 18,
    marginTop: 5,
  },
});

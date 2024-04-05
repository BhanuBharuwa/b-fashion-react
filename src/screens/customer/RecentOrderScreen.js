import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {urls} from '../../constants/urls';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../constants/theme';
import Divider from '../../components/Divider';
import EmptyCustomer from '../../svg/EmptyCustomer';
import {Modal} from 'react-native-paper';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import moment from 'moment';

const containerStyle = {
  backgroundColor: 'white',
  paddingVertical: 20,
  paddingHorizontal: 10,
  marginHorizontal: 10,
};

const RecentOrderScreen = ({route}) => {
  const {id} = route.params;
  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [profile, setProfile] = useState({});
  const [selectedOrder, setSelectedOrder] = useState({});

  useEffect(() => {
    feachRecentOrder();
    accountDetails();
  }, []);

  async function accountDetails() {
    const profile = await AsyncStorage.getItem('profile');
    setProfile(JSON.parse(profile));
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

  const ShareModel = () => (
    <Modal
      animationType="fade"
      transparent={false}
      onDismiss={() => setShareVisible(false)}
      visible={shareVisible}
      contentContainerStyle={containerStyle}>
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 16,
          color: theme.primaryColor,
          fontWeight: 'bold',
          textDecorationLine: 'underline',
        }}>
        Share Payment
      </Text>
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          padding: 10,
        }}
        onPress={() => {
          sendSms();
        }}>
        <Icon name="android-messages" size={20} color={theme.primaryColor} />
        <Text style={styles.shareBtton}>Send Message</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{width: '100%', flexDirection: 'row', padding: 10}}
        onPress={() => {
          convertPDF();
        }}>
        <Icon name="file-pdf-box" size={20} color={theme.primaryColor} />
        <Text style={styles.shareBtton}>Export to PDF</Text>
      </TouchableOpacity>
    </Modal>
  );

  const feachRecentOrder = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.recentOrder + id,

        method: 'GET',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
      });

      if (response.data.success) {
        setOrder(response.data.data.orders);
        setIsLoading(false);
      } else {
        console.log(response.data.errors);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('RecentOrder /catch: ', error);
      setIsLoading(false);
    }
  };

  const convertPDF = async () => {
    let products = [];
    let total_quantity = 0;
    products = selectedOrder.products.map((item, index) => ({item, index}));
    selectedOrder.products.map(item => {
      total_quantity = total_quantity + item.quantity;
    });
    const results = await RNHTMLtoPDF.convert({
      html: `
                <H1>PASSI FROZEN FOODS</H1>
                <b>Date:</b> ${moment(selectedOrder.created_at).format(
                  'DD-MM-YYYY',
                )}</br></br>
                <b>Customer Name:</b> ${selectedOrder.customer_name}<br/><br/>
                <b>Products: </b><br/>
                <table border="1px">
                    <tr>
                        <th>SN</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                    </tr>
                    ${products.map(
                      product =>
                        `<tr>
                                    <td>${product.index + 1}</td>
                                    <td>${product.item.name}</td>
                                    <td>${
                                      product.item.quantity + product.item.unit
                                    }</td>
                                    <td>${product.item.rate}</td>
                                <tr>`,
                    )}
                    <tr>
                        <td colspan="2"><center>Grand total</center></td>
                        <td >${total_quantity}</td>
                        <td>${selectedOrder.total_amount.toFixed(2)}</td>
                    </tr>
                </table><br />
                <b>Taken by:</b> ${profile.name}<br><br>
                </p>
                `,
      fileName: 'Order_',
      base64: true,
    });

    FileViewer.open(results.filePath, {showOpenWithDialog: true})
      .then(() => {
        ('File open successful!');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const sendSms = async () => {
    let products = '';
    selectedOrder.products.map(item => {
      products = products.concat(
        item.name + ' * ' + item.quantity + item.unit + ` * ${item.rate}\n`,
      );
    });

    let body =
      'PASSI FROZEN FOODS' +
      '\nDate: ' +
      moment(selectedOrder.created_at).format('DD-MM-YYYY') +
      '\nOrder number ' +
      selectedOrder.order_number +
      '\nOrder taken by ' +
      profile.name +
      '\nOrder taken from ' +
      selectedOrder.customer_name +
      '\nProducts\n' +
      products +
      'Total Amount: ₹ ' +
      selectedOrder.total_amount.toFixed(2);
    const phone = await AsyncStorage.getItem('customer_mobile');

    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = 'sms:' + phone + separator + 'body=' + body;
    await Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={order}
        ListEmptyComponent={renderEmptyView()}
        keyExtractor={item => item._id}
        refreshing={isLoading}
        onRefresh={() => feachRecentOrder()}
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
              <TouchableOpacity onPress={() => {}} style={styles.activity_item}>
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
                    <Text style={styles.created_at}>
                      {moment(item.created_at).format('DD-MM-YYYY')}
                    </Text>
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
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedOrder(item);
                      setShareVisible(true);
                    }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginTop: 5,
                      backgroundColor: theme.primaryColor,
                      marginRight: 10,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}>
                    <Text style={[{color: '#fff'}]}>Share</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              <Divider />
            </View>
          );
        }}
      />
      <ShareModel />
    </View>
  );
};

export default RecentOrderScreen;
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
  shareBtton: {
    color: '#000',
    marginLeft: 20,
    marginRight: 20,
    // fontWeight: "bold",
    fontSize: 14,
    paddingBottom: 5,
  },
});

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
import RNPrint from 'react-native-print';
import moment from 'moment';
import FileViewer from 'react-native-file-viewer';

const RecentPaymentScreen = ({route}) => {
  const {id} = route.params;
  const [payment, setPayment] = useState([]);
  const [data, setSelectPayment] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [profile, setProfile] = useState({});

  const containerStyle = {
    backgroundColor: 'white',
    paddingVertical: 20,
    marginHorizontal: 10,
  };

  useEffect(() => {
    fetchRecentPayment();
    accountDetails();
  }, []);

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
          Payment Unavailable!
        </Text>
      </View>
    );
  };

  async function accountDetails() {
    const profile = await AsyncStorage.getItem('profile');
    setProfile(JSON.parse(profile));
  }

  const convertPDF = async () => {
    let otherbankDetail =
      data.bank_name == 'Other'
        ? '<b>Other Bank: </b>' + data.other_bank + '</br></br>'
        : '';
    let chequeDetail =
      data.payment_type_name == 'Cheque'
        ? '<b>Bank Name: </b>' +
          data.bank_name +
          '</br></br>' +
          otherbankDetail +
          '<b>Cheque Number:</b> ' +
          data.cheque_number +
          '</br></br>'
        : '';
    const results = await RNHTMLtoPDF.convert({
      html: `
      <H3>PASSI FROZEN FOODS</H3>
      <p>
      <b>Payment Number:</b> ${data.payment_number}</br></br>
      <b>Date:</b> ${moment(data.created_at).format('DD-MM-YYYY')}</br></br>
      <b>Customer Name:</b> ${data.customer_name}</br></br>
      <b>Amount:</b> ${data.amount}</br></br>
      <b>Payment Type:</b> ${data.payment_type_name}</br></br>
      ${chequeDetail}
      <b>Receive By:</b> ${profile.name}</br></br>
      </p>
      `,
      fileName: 'test',
      base64: true,
    });
    FileViewer.open(results.filePath, {showOpenWithDialog: true})
      .then(() => {
        console.log('File open successful!');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const printPDF = async () => {
    let otherbankDetail =
      data.bank_name == 'Other'
        ? 'Other Bank: ' + data.other_bank + '</br>'
        : '';
    let chequeDetail =
      data.payment_type_name == 'Cheque'
        ? 'Bank Name: ' +
          data.bank_name +
          '</br>' +
          otherbankDetail +
          'Cheque Number: ' +
          data.cheque_number +
          '</br>'
        : '';
    await RNPrint.print({
      html: `<!DOCTYPE html>
        <html lang="en" >
        <head>
          <meta charset="UTF-8">
          <link rel="shortcut icon" type="image/x-icon" href="https://static.codepen.io/assets/favicon/favicon-8ea04875e70c4b0bb41da869e81236e54394d63638a1ef12fa558a4a835f1164.ico" />
          <link rel="mask-icon" type="" href="https://static.codepen.io/assets/favicon/logo-pin-f2d2b6d2c61838f7e76325261b7195c27224080bc099486ddd6dccb469b8e8e6.svg" color="#111" />
          <title>CodePen - POS Receipt Template Html Css</title>

          <style>
        @media print {
            .page-break { display: block; page-break-before: always; }
        }
              #invoice-POS {
          box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
          padding: 2mm;
          margin: 0 auto;
          width: 44mm;
          background: #FFF;
        }
        #invoice-POS ::selection {
          background: #f31544;
          color: #FFF;
        }
        #invoice-POS ::moz-selection {
          background: #f31544;
          color: #FFF;
        }
        #invoice-POS h1 {
          font-size: 1.5em;
          color: #222;
        }
        #invoice-POS h2 {
          font-size: .9em;
        }
        #invoice-POS h3 {
          font-size: 1.2em;
          font-weight: 300;
          line-height: 2em;
        }
        #invoice-POS p {
          font-size: .7em;
          color: #666;
          line-height: 1.2em;
        }
        #invoice-POS #top, #invoice-POS #mid, #invoice-POS #bot {
          /* Targets all id with 'col-' */
          border-bottom: 1px solid #EEE;
        }
        #invoice-POS #top {
          min-height: 20px;
        }
        #invoice-POS #mid {
          min-height: 80px;
        }
        #invoice-POS #bot {
          min-height: 50px;
        }

        #invoice-POS #top .logo {
            height: 70px;
            width: 80px;
            background-image: url('http://newmahalaxmi.b-force.in/img/passi-logo.jpeg');
            background-size: 80px 70px;
        }

        .watermark {
            position: absolute;
            align-self: center;
            z-index: 1;
            top: 150px;
            opacity: 0.2;
            height: 70px;
            width: 44mm;
            background-image: url('http://newmahalaxmi.b-force.in/img/passi-logo.jpeg');
            background-repeat: no-repeat;
            background-size: 80px 70px;
            bottom: 40%;
        }

        
        #invoice-POS .info {
          display: block;
          margin-left: 0;
        }
        #invoice-POS .title {
          float: right;
        }
        #invoice-POS .title p {
          text-align: right;
        }
        #invoice-POS table {
          width: 100%;
          border-collapse: collapse;
        }
        #invoice-POS .tabletitle {
          font-size: .5em;
          background: #EEE;
        }
        #invoice-POS .service {
          border-bottom: 1px solid #EEE;
        }
        #invoice-POS .item {
          width: 24mm;
        }
        #invoice-POS .itemtext {
          font-size: .5em;
        }
        #invoice-POS #legalcopy {
          margin-top: 5mm;
        }
            </style>
          <script>
          window.console = window.console || function(t) {};
        </script>

          <script>
          if (document.location.search.match(/type=embed/gi)) {
            window.parent.postMessage("resize", "*");
          }
        </script>
        </head>
        <body translate="no" >
          <div id="invoice-POS">
            <center id="top">
            <div class="logo"></div>
              <div class="info"> 
                <h2>PASSI FROZEN FOODS</h2>
              </div><!--End Info-->
            </center><!--End InvoiceTop-->
            <div id="mid">
            <div class="watermark"></div>
              <div class="info">
                <h2>Payment Info</h2>
                <p style="font-weight:600; color:"#000"> 
                    Payment Number : ${data.payment_number}</br>
                    Date   : ${data.created_at}</br>
                    Customer Name   : ${data.customer_name}</br>
                    Amount   : ${data.amount}</br>
                    Payment Type    : ${data.payment_type_name}</br>
                    ${chequeDetail}
                    Received By    : ${profile.name}</br>
                </p>
              </div>
            </div><!--End Invoice Mid-->
          </div><!--End Invoice-->
        </body>
        </html>`,
    });
  };

  const sendSms = async () => {
    let otherbankDetail =
      data.bank_name == 'Other' ? '\nOther Bank: ' + data.other_bank : '';
    let chequeDetail =
      data.payment_type_name == 'Cheque'
        ? '\nBank Name: ' +
          data.bank_name +
          otherbankDetail +
          '\nCheque Number: ' +
          data.cheque_number
        : '';
    let body =
      'PASSI FROZEN FOODS' +
      '\nDate: ' +
      moment(data.created_at).format('DD-MM-YYYY') +
      '\nPayment number ' +
      data.payment_number +
      '\nPayment received by ' +
      profile.name +
      '\nPayment received from ' +
      data.customer_name +
      '\nTotal Amount: ₹' +
      data.amount +
      '\nPayment Method: ' +
      data.payment_type_name +
      chequeDetail;
    const phone = await AsyncStorage.getItem('customer_mobile');
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = 'sms:' + phone + separator + 'body=' + body;
    await Linking.openURL(url);
  };

  const shareModel = () => (
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
          printPDF();
        }}>
        <Icon name="printer" size={20} color={theme.primaryColor} />
        <Text style={styles.shareBtton}>Print Receipt</Text>
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
  const fetchRecentPayment = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.recentPayment + id,
        method: 'GET',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
      });

      if (response.data.success) {
        setPayment(response.data.data.payments);
        setIsLoading(false);
      } else {
        console.log(response.data.errors);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('RecentPayment/catch: ', error);
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <FlatList
        style={{backgroundColor: '#fff'}}
        data={payment}
        ListEmptyComponent={renderEmptyView()}
        keyExtractor={item => item._id}
        refreshing={isLoading}
        onRefresh={() => fetchRecentPayment()}
        renderItem={({item, key}) => {
          let statusColor =
            item.status === 'pending'
              ? 'orange'
              : item.status === 'confirmed'
              ? 'green'
              : 'red';

          return (
            <View>
              <TouchableOpacity key={item.key} style={styles.activity_item}>
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
                  <TouchableOpacity
                    onPress={() => {
                      setShareVisible(true);
                      setSelectPayment(item);
                    }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginTop: 5,
                      backgroundColor: theme.primaryColor,
                    }}>
                    <Text style={[styles.currency, {color: '#fff'}]}>
                      Share
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              <Divider />
            </View>
          );
        }}
      />
      {shareModel()}
    </View>
  );
};

export default RecentPaymentScreen;
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
    color: theme.primaryColor,
    fontWeight: '100',
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
  shareBtton: {
    color: '#000',
    marginLeft: 20,
    marginRight: 20,
    // fontWeight: "bold",
    fontSize: 14,
    paddingBottom: 5,
  },
});

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Button,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import ListItem from '../../components/ListItem';
import {theme} from '../../constants/theme';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modal} from 'react-native-paper';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import moment from 'moment';
import FileViewer from 'react-native-file-viewer';
import {urls} from '../../constants/urls';

const initialLayout = {width: Dimensions.get('window').width};
const PaymentDetailScreen = ({route, navigation}) => {
  const [index, setIndex] = React.useState(0);
  const {data} = route.params;
  const [profile, setProfile] = useState({});
  const [shareVisible, setShareVisible] = useState(false);

  useEffect(() => {
    accountDetails();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{marginRight: 20}}
          onPress={() => {
            setShareVisible(true);
          }}>
          <Icon name="share-variant" size={25} color={theme.primaryColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  async function accountDetails() {
    const profile = await AsyncStorage.getItem('profile');
    setProfile(JSON.parse(profile));
  }

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
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url =
      'sms:' + data.customer_contact_number + separator + 'body=' + body;
    await Linking.openURL(url);
  };

  const [routes] = React.useState([
    {key: 'first', title: 'DETAIL'},
    // { key: 'second', title: 'ACTIVITY' },
  ]);
  const containerStyle = {
    backgroundColor: 'white',
    paddingVertical: 30,
    marginHorizontal: 10,
  };
  const FirstRoute = () => (
    <View style={styles.list_item}>
      <ListItem title="Payment number" value={data.payment_number} />
      <ListItem title="Customer Name" value={data.customer_name} />
      <ListItem title="Date" value={data.created_at} />
      <ListItem title="Amount" value={`₹ ${data.amount}`} />
      <ListItem title="Payment Type" value={data.payment_type_name} />
      {data.bank_name == null ? null : (
        <ListItem title="Bank Name" value={data.bank_name} />
      )}
      {data.other_bank == null ? null : (
        <ListItem title="Other Name" value={data.other_bank} />
      )}
      {data.cheque_number == null ? null : (
        <ListItem title="Cheque Number" value={data.cheque_number} />
      )}
      <ListItem title="Payment Status" value={data.status} />
    </View>
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
      <b>Date:</b> ${data.created_at}</br></br>
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
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="shortcut icon" type="image/x-icon"
        href="https://static.codepen.io/assets/favicon/favicon-8ea04875e70c4b0bb41da869e81236e54394d63638a1ef12fa558a4a835f1164.ico" />
    <link rel="mask-icon" type=""
        href="https://static.codepen.io/assets/favicon/logo-pin-f2d2b6d2c61838f7e76325261b7195c27224080bc099486ddd6dccb469b8e8e6.svg"
        color="#111" />
    <title>CodePen - POS Receipt Template Html Css</title>

    <style>
        @media print {
            .page-break {
                display: block;
                page-break-before: always;
            }
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

        #invoice-POS #top,
        #invoice-POS #mid,
        #invoice-POS #bot {
            /* Targets all id with 'col-' */
            border-bottom: 1px solid #EEE;
        }

        #invoice-POS #top {
            min-height: 20px;
        }

        #invoice-POS #mid {
            min-height: 80px;
            width: 100%;
            /* display: flex;
          flex: 1; */
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
            display: flex;
            justify-content: center;
            flex-direction: column;
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
        window.console = window.console || function (t) { };
    </script>

    <script>
        if (document.location.search.match(/type=embed/gi)) {
            window.parent.postMessage("resize", "*");
        }
    </script>
</head>

<body translate="no">
    <div id="invoice-POS">
        <center id="top">
            <div class="logo"></div>
            <div class="info">
                <h2>PASSI FROZEN FOODS</h2>
            </div>
            <!--End Info-->
        </center>
        <!--End InvoiceTop-->
        <div id="mid">
            <div class="watermark"></div>
            <div class="info">
                <h2>Payment Info</h2>
                <p style="font-weight:600; color:" #000">
                    Payment Number : ${data.payment_number}</br>
                    Date : ${data.created_at}</br>
                    Customer Name : ${data.customer_name}</br>
                    Amount : ${data.amount}</br>
                    Payment Type : ${data.payment_type_name}</br>
                    ${chequeDetail}
                    Received By : ${profile.name}</br>
                </p>
            </div>
        </div>
        <!--End Invoice Mid-->
    </div>
    <!--End Invoice-->
</body>

</html>`,
    });
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
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
          <Icon name="file-pdf" size={20} color={theme.primaryColor} />
          <Text style={styles.shareBtton}>Export to PDF</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PaymentDetailScreen;

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

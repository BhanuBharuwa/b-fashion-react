import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import moment from 'moment';

import {Picker} from '@react-native-picker/picker';
import Snackbar from 'react-native-snackbar';
import {ScrollView} from 'react-native-gesture-handler';

import {theme} from '../../constants/theme';
import {urls} from '../../constants/urls';
import {currencies} from '../../constants/banknotes';

const AddPaymentScreen = ({route, navigation}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [chequeNumber, setChequeNumber] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [otherBank, setOtherBank] = useState('');
  const [paymentTypeList, setPaymentTypeList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [note, setNote] = useState([]);
  const [paymentType, setPaymentType] = useState('none');
  const [bankType, setBankType] = useState('none');
  const [profile, setProfile] = useState({});
  const [payment, setPayment] = useState({});
  const [bank, setBank] = useState({});
  const [amountsArray, setAmountsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const phone = route.params.phone;
  const CustomerBalance = route.params.CustomerBalance;
  useEffect(() => {
    getPaymentType();
    getBanks();
    accountDetails();
    getNote();
  }, []);

  async function accountDetails() {
    const profile = await AsyncStorage.getItem('profile');
    setProfile(JSON.parse(profile));
  }

  const getPaymentType = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.paymentType,
        method: 'GET',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
      });

      if (response.data.success) {
        setPaymentTypeList(response.data.data.payment_types);
      } else {
        console.log(response.data.errors);
      }
    } catch (error) {
      console.log('AddCustomerScreen/catch: ', error);
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const getBanks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.banks,
        method: 'GET',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
      });
      if (response.data.success) {
        setBankList(response.data.data.banks);
      } else {
        console.log(response.data.errors);
      }
    } catch (error) {
      console.log('AddCustomerScreen/catch: ', error);
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const getNote = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.note,
        method: 'GET',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
      });
      if (response.data.success) {
        setNote(response.data.data.notes);
      } else {
        console.log(response.data.errors);
      }
    } catch (error) {
      console.log('AddCustomerScreen/catch: ', error);
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  function showSnackbar(text) {
    Snackbar.show({
      text,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  const handleSubmit = async () => {
    let data = {
      payment_type_id: paymentType,
      amount,
      description,
      denominations: JSON.stringify(amountsArray),
      bank_id: bankType,
      other_bank: otherBank,
      cheque_number: chequeNumber,
    };
    addPayment(data);
  };

  const addPayment = async data => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.payment,
        method: 'POST',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
        data,
      });

      if (response.data.success) {
        setIsLoading(false);
        setPaymentSuccess(response.data.data.payment_number);
        setAmount('');
        setDescription('');
        setPaymentType('none');
        Alert.alert(
          'Success',
          'Payment added successfully. Do you want to send a message to the customer?',
          [
            {
              text: 'No',
              onPress: () => {
                navigation.pop();
              },
              style: 'cancel',
            },
            {
              text: 'YES',
              onPress: () => {
                navigation.pop();
                sendSms(response.data.data.payment_number);
              },
            },
          ],
        );
      } else {
        setIsLoading(false);
        console.log('payment', response.data.errors);
        if (response.data.errors.punch_in) {
          showSnackbar(response.data.errors.punch_in);
        }
        if (response.data.errors.check_in) {
          showSnackbar(response.data.errors.check_in);
        }
        if (response.data.errors.payment_type_id) {
          showSnackbar(response.data.errors.payment_type_id);
        }
        if (response.data.errors.amount) {
          showSnackbar(response.data.errors.amount);
        }
        if (response.data.errors.denominations) {
          showSnackbar(response.data.errors.denominations);
        }
        if (response.data.errors.bank_id) {
          showSnackbar(response.data.errors.bank_id);
        }
        if (response.data.errors.other_bank) {
          showSnackbar(response.data.errors.other_bank);
        }
        if (response.data.errors.cheque_number) {
          showSnackbar(response.data.errors.cheque_number);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log('addPayment: ', error);
      Alert.alert('Error', JSON.stringify(error));
    }
  };

  const sendSms = async payment_number => {
    // let payment = paymentTypeList.filter(item => item._id === paymentType)
    let otherbankDetail =
      bank.name == 'Other' ? '\nOther Bank: ' + otherBank : '';
    let chequeDetail =
      payment.name == 'Cheque'
        ? '\nBank Name: ' +
          bank.name +
          otherbankDetail +
          '\nCheque Number: ' +
          chequeNumber
        : '';
    let body =
      'PASSI FROZEN FOODS' +
      '\nDate: ' +
      moment().format('DD-MM-YYYY') +
      '\nPayment received by ' +
      profile.name +
      '\nPayment Number: ' +
      payment_number +
      '\nTotal Amount: ₹' +
      amount +
      '\nPayment Method: ' +
      payment.name +
      chequeDetail;
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = 'sms:' + phone + separator + 'body=' + body;
    await Linking.openURL(url);
  };

  const handlePickerSelection = (value, index) => {
    let itemIndex = index - 1;
    setPaymentType(value);

    if (itemIndex >= 0 && itemIndex <= paymentTypeList.length - 1) {
      setPayment(paymentTypeList[itemIndex]);
    } else {
      setPayment([]);
    }
  };

  const handleBankPickerSelection = (value, index) => {
    let itemIndex = index - 1;
    setBankType(value);

    if (itemIndex >= 0 && itemIndex <= bankList.length - 1) {
      setBank(bankList[itemIndex]);
    } else {
      setBank([]);
    }
  };

  const handleAmountChange = (note, quantity, index) => {
    quantity = quantity === '' ? 0 : quantity;
    if (quantity >= 0) {
      if (amountsArray.length < 1) {
        setAmountsArray(state => [...state, {id: index, note, quantity}]);
      } else {
        setAmountsArray(amountsArray.filter(item => item.id !== index));
        setAmountsArray(state => [...state, {id: index, note, quantity}]);
      }
    }
  };

  useEffect(() => {
    getTotal();
  }, [amountsArray]);

  const getTotal = () => {
    let tmp_total = 0;

    amountsArray.map(e => {
      let sub = e.quantity * e.note;
      tmp_total = sub + tmp_total;
    });
    setAmount(tmp_total);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.input_container}>
        <Text style={styles.label}>Customer</Text>
        <Text style={{color: 'black', fontSize: 16}}>{route.params.name}</Text>
      </View>
      <View pointerEvents="none" style={styles.input_container}>
        <Text style={styles.label}>Customer Outstanding</Text>
        <TextInput
          editable={false}
          style={[styles.input_text, {color: '#000'}]}
          value={'₹ ' + CustomerBalance.toString()}
        />
      </View>
      <View pointerEvents="none" style={styles.input_container}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          editable={false}
          style={[styles.input_text, {fontWeight: 'bold'}]}
          value={moment().format('DD-MM-YYYY')}
        />
      </View>

      <View style={[styles.input_container, {marginBottom: 0}]}>
        <Text style={styles.label}>Payment Type</Text>
        <Picker
          selectedValue={paymentType}
          style={{height: 50}}
          onValueChange={(itemValue, itemIndex) =>
            handlePickerSelection(itemValue, itemIndex)
          }>
          <Picker.Item label={'Select a method'} value={'none'} />
          {paymentTypeList.map((e, key) => {
            return <Picker.Item key={key} label={e.name} value={e._id} />;
          })}
        </Picker>
      </View>
      {payment.name === 'Cheque' ? (
        <View>
          <View style={[styles.input_container, {marginBottom: 0}]}>
            <Text style={styles.label}>Bank Name</Text>
            <Picker
              selectedValue={bankType}
              style={{height: 50}}
              onValueChange={(itemValue, itemIndex) => {
                handleBankPickerSelection(itemValue, itemIndex);
              }}>
              <Picker.Item label={'Select a Bank'} value={'none'} />
              {bankList.map((e, key) => {
                return <Picker.Item key={key} label={e.name} value={e._id} />;
              })}
            </Picker>
          </View>
          {bank.name === 'Other' ? (
            <View style={styles.input_container}>
              <Text style={styles.label}>Other Bank Name</Text>
              <TextInput
                style={styles.input_text}
                onChangeText={amt => {
                  setOtherBank(amt);
                }}
                placeholder="Bank Name"
                value={otherBank}
              />
            </View>
          ) : null}
          <View style={styles.input_container}>
            <Text style={styles.label}>Cheque Number</Text>
            <TextInput
              style={styles.input_text}
              onChangeText={amt => {
                setChequeNumber(amt);
              }}
              placeholder="Cheque Number"
              value={chequeNumber}
            />
          </View>
        </View>
      ) : null}

      {payment.name !== 'Cash' ? (
        <View style={styles.input_container}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input_text}
            keyboardType={'number-pad'}
            onChangeText={amt => {
              setAmount(amt);
            }}
            placeholder="Amount"
            value={amount.toString()}
          />
        </View>
      ) : null}
      {payment.name === 'Cash' ? (
        <View
          style={{
            backgroundColor: '#ADD8E6',
            paddingHorizontal: 20,
            marginBottom: 10,
            borderRadius: 10,
          }}>
          {note.map((note, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  borderColor: 'gray',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  borderBottomWidth: 0.5,
                  borderStyle: 'dashed',
                }}>
                <Text style={{fontSize: 15}}>₹ {note}</Text>
                <Text>x</Text>
                <TextInput
                  onChangeText={unit => {
                    handleAmountChange(note, unit, index);
                  }}
                  textAlign="center"
                  placeholder="Unit"
                  keyboardType="number-pad"
                />
              </View>
            );
          })}
          <Text
            style={{
              alignSelf: 'flex-end',
              marginEnd: 30,
              marginVertical: 10,
              fontWeight: 'bold',
              fontSize: 16,
              letterSpacing: 1,
            }}>
            ₹ {amount}
          </Text>
        </View>
      ) : null}

      <View style={styles.input_container}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input_text}
          multiline={true}
          numberOfLines={3}
          onChangeText={desc => {
            setDescription(desc);
          }}
          placeholder="Description"
          value={description}
        />
      </View>

      <TouchableOpacity
        style={styles.button_container}
        onPress={() => {
          handleSubmit();
        }}
        disabled={isLoading}>
        <View style={styles.button}>
          {isLoading ? (
            <ActivityIndicator animating={true} size={18} color={'white'} />
          ) : (
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 18,
                letterSpacing: 1,
              }}>
              SUBMIT
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddPaymentScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  label: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },

  input_text: {
    borderColor: theme.primaryColorDark,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 10,
    marginTop: 5,
    height: Platform.OS === 'ios' ? 30 : null,
  },

  input_container: {
    marginBottom: 10,
  },

  button_container: {
    backgroundColor: theme.primaryColorDark,
    paddingVertical: 10,
    width: '60%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
});

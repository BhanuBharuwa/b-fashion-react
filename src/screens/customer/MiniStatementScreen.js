import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {FlatList, StyleSheet, View} from 'react-native';
import {theme} from '../../constants/theme';
import {urls} from '../../constants/urls';
import AsyncStorage from '@react-native-community/async-storage';
import {Caption, Subheading, Text} from 'react-native-paper';
import Divider from '../../components/Divider';

// Geocoder.init('AIzaSyAZpUWh4WwNjHYJGuKyTpm4qW3MCaXnrjQ');

const MiniStatement = ({route}) => {
  const {id} = route.params;

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getMiniStatement();
  }, []);

  const getMiniStatement = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.customers + `/${id}/mini-statement`,
        method: 'GET',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
      });

      if (response.data.success) {
        setTransactions(response.data.data.transactions);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log('MINISTATEMENT: ', error);
    }
  };
  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={{alignSelf: 'center'}}>Statement Unavailable</Text>
        )}
        data={transactions}
        renderItem={({item}) => (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff',
                padding: 10,
                marginBottom: 2,
              }}>
              <View>
                <Subheading>{item.transaction_number}</Subheading>
                <Caption>{item.particular}</Caption>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Caption>{item.date}</Caption>
                <Subheading>₹ {item.balance}</Subheading>
                <Caption style={{color: item.credit == 0 ? 'green' : 'red'}}>
                  {' '}
                  ₹ {item.credit == 0 ? item.debit : item.credit}
                </Caption>
              </View>
            </View>
          </>
        )}
      />
    </View>
  );
};

export default MiniStatement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  label: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },

  input_text: {
    fontSize: 16,
    paddingHorizontal: 10,
    marginTop: 5,
    height: Platform.OS === 'ios' ? 50 : null,
  },

  input_container: {
    marginBottom: 10,
    borderRadius: 10,
  },

  picker_container: {
    width: '100%',
    backgroundColor: theme.inputBackground,
    borderRadius: 10,
  },

  fab: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.primaryColor,
  },
  button_container: {
    backgroundColor: theme.primaryColorDark,
    paddingVertical: 10,
    width: '60%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
});

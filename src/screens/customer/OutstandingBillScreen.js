import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert
} from 'react-native';
import { Card } from "react-native-paper";
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { urls } from '../../constants/urls';

const OutStandinfBillScreen = ({ route }) => {
  const { id } = route.params;
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOutStandingBills();
  }, [])

  const getOutStandingBills = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        method: 'GET',
        url:
          urls.prefix + company +
          urls.customers + '/' + id +
          '/pending-bills',
        headers: {
          version: '1',
          'x-auth': token,
        },
      });

      const { data } = response;

      if (data.success) {
        const { data: { pending_bills } } = data;
        setBills(pending_bills);
        setIsLoading(false);
      } else {
        const { errors } = data;
        if (errors.id) {
        } else {
          Alert.alert(null, "Unable to fetch bills data.");
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bills}
        refreshing={isLoading}
        onRefresh={getOutStandingBills}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 10 }}
        keyExtractor={(item, _) => item.bill_number}
        renderItem={({ item }) => (
          <Card
            key={item.key}
            style={styles.item}>

            <View style={styles.row}>
              <Text style={styles.title}>#{item.short_bill_number}</Text>
              <Text style={styles.title}>{item.bill_date}</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.billDetails}>
                <Text><Icon name='clock-time-four-outline' size={16} /> {item.bill_time}</Text>
                <Text><Icon name='receipt' size={16} /> {item.bill_number}</Text>
              </View>
              <View style={styles.amountWrapper}>
                <Text style={styles.title}>₹</Text>
                <Text style={styles.title}>{item.bill_amount}</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

export default OutStandinfBillScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  },

  item: {
    padding: 10,
    marginBottom: 15,
  },

  row: {
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  billDetails: {
    flex: 1,
    justifyContent: 'space-around',
  },

  amountWrapper: {
    width: '30%',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
  }
});

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {theme} from '../constants/theme';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {urls} from '../constants/urls';
import EmptyCustomer from '../svg/EmptyCustomer';

const NewsScreen = ({navigation}) => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getNews();
  }, []);

  const getNews = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.news,
        method: 'GET',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
      });

      if (response.data.success === true) {
        setNews(response.data.data.news);
      } else {
        if (response.data.errors.token === 'token_invalid') {
          AsyncStorage.clear();
          navigation.navigate('AuthStack');
          Alert.alert('Error', 'Login form another devices');
        }
      }
    } catch (error) {
      console.log('OrdersScreen/GetOrders: ', error);
      Alert.alert('Error', error);
    }
  };

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
          No news at the moment!
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.list_item}>
        <FlatList
          data={news}
          refreshing={isLoading}
          onRefresh={() => {
            getNews();
          }}
          ListEmptyComponent={renderEmptyView()}
          keyExtractor={item => item._id}
          renderItem={({item, index}) => {
            return (
              <View style={styles.activity_item}>
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() =>
                    navigation.navigate('NewsDetailScreen', {id: item._id})
                  }>
                  <View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={{color: 'gray'}}>
                      Expires on: {item.expiry_date}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default NewsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  head_title: {
    marginStart: 10,
    marginTop: 2,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  vender_name: {
    marginStart: 5,
    fontWeight: 'bold',
  },
  list_item: {
    flex: 1,
    backgroundColor: 'white',
  },
  vender: {
    flexDirection: 'row',
  },
  activity_item: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingLeft: 10,
    marginVertical: 6,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  icon: {
    marginStart: 10,
    marginEnd: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkbox: {
    position: 'absolute',
    right: 20,
  },

  fab: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.primaryColor,
  },
});

import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Alert, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {List} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {theme} from '../../constants/theme';

import {urls} from '../../constants/urls';

const BrandListScreen = ({route, navigation}) => {
  const [brands, setBrands] = useState([]);

  const {id} = route.params;

  useEffect(() => {
    getBrandList();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{marginRight: 20}}
          onPress={() => {
            navigation.navigate('CartScreen', {backto: 4});
          }}>
          <Icon name="cart-minus" size={25} color={theme.primaryColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getBrandList = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.subCategories + '/' + id + '/brands',
        method: 'GET',
        headers: {
          'x-auth': token,
          version: '1',
        },
      });
      if (response.data.success === true) {
        setBrands(response.data.data.brands);
      } else {
        console.log('getBrandList', response.data);
      }
    } catch (error) {
      console.log('Catch/getBrandList: ', error);
      Alert.alert('Error', error);
    }
  };

  return (
    <View>
      <FlatList
        data={brands}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          return (
            <List.Item
              onPress={() => {
                navigation.navigate('ProductListScreen', {id: item._id});
              }}
              title={item.name}
              right={props => <List.Icon {...props} icon="apps" />}
            />
          );
        }}
      />
    </View>
  );
};

export default BrandListScreen;

import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Alert, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {List} from 'react-native-paper';

import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {theme} from '../../constants/theme';

import {urls} from '../../constants/urls';

const SubCaregoryListScreen = ({route, navigation}) => {
  const [subCategories, setSubCategories] = useState([]);
  const {id} = route.params;

  useEffect(() => {
    getSubCategoryList();
  }, []);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{marginRight: 20}}
          onPress={() => {
            navigation.navigate('CartScreen', {backto: 3});
          }}>
          <Icon name="cart-minus" size={25} color={theme.primaryColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getSubCategoryList = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.categories + `/${id}/sub-categories`,
        method: 'GET',
        headers: {
          'x-auth': token,
          version: '1',
        },
      });
      if (response.data.success === true) {
        setSubCategories(response.data.data.sub_categories);
      } else {
        console.log('ProductListScreen/getSubCategoryList', response.data);
      }
    } catch (error) {
      console.log('Catch/getSubCategoryList: ', error);
      Alert.alert('Error', error);
    }
  };

  return (
    <View>
      <FlatList
        data={subCategories}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          return (
            <List.Item
              onPress={() => {
                navigation.navigate('BrandListScreen', {id: item._id});
              }}
              title={item.name}
              right={props => <List.Icon {...props} icon="blur" />}
            />
          );
        }}
      />
    </View>
  );
};

export default SubCaregoryListScreen;

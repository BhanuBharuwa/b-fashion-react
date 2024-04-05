import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ActivityIndicator, Divider, List, Text, TouchableRipple} from 'react-native-paper';
import {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {urls} from '../../constants/urls';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';

const CategoryRender = ({
  item,
  getProduct,
  selectedUnit,
  setShowUnitModel,
  isExpanded,
  onExpandPress,
}) => {
  const [subCategory, setSubCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(false)

  const handlePress = async id => {
    setLoading(true)
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
        setSubCategory(response.data.data.sub_categories);
      } else {
        console.log('ProductListScreen/getSubCategoryList', response.data);
      }
    } catch (error) {
      console.log('Catch/getSubCategoryList: ', error);
      Alert.alert('Error', error);
    }
    setLoading(false)
  };

  const handleProductSelect = id => {
    if (selectedUnit) {
      getProduct(id);
    } else {
      setShowUnitModel(true, id);
    }
  };

  return (
    <>
      <TouchableRipple
        style={[
          styles.container,
          {borderColor: isExpanded ? colors.primary : colors.dark},
        ]}
        onPress={() => {
          handlePress(item._id);
          onExpandPress(item._id);
        }}>
        <>
          <Text style={{color: isExpanded ? colors.primary : 'black'}}>
            {item.name}
          </Text>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Icon
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={22}
              color={isExpanded ? colors.primary : 'black'}
            />
          )}
        </>
      </TouchableRipple>

      {isExpanded &&
        subCategory.map((e, i) => (
          <View style={{marginHorizontal: 10}}>
            <TouchableOpacity
              onPress={() => {
                handleProductSelect(e._id);
                setSelectedSubCategory(e._id);
              }}
              style={styles.categories}>
              <Text
                style={[
                  styles.subText,
                  {
                    color:
                      selectedSubCategory === e._id
                        ? colors.primary
                        : colors.dark,
                  },
                ]}>
                {e.name}
              </Text>
              <Icon
                name="chevron-right"
                size={20}
                color={
                  selectedSubCategory === e._id ? colors.primary : colors.dark
                }
              />
            </TouchableOpacity>
            {i === subCategory.length - 1 ? null : <Divider bold={true} />}
          </View>
        ))}
    </>
  );
};

export default CategoryRender;

const styles = StyleSheet.create({
  subText: {
    fontSize: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark,
    marginVertical: 2,
    marginEnd: 2,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

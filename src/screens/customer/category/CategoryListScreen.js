import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {Appbar, Divider, Modal, Portal, Text, Title} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, theme} from '../../../constants/theme';

import {useFocusEffect} from '@react-navigation/native';
import {urls} from '../../../constants/urls';
import CategoryRender from '../../../components/category/CategoryRender';
import useProduct from '../hooks/useProduct';
import LoadingView from '../../../components/LoadingView';
import SubCategoryItemList from '../../../components/category/SubCategoryItemList';

const CategoryListScreen = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [expandedId, setExpanded] = useState(null);

  const {units} = useProduct();

  const [showUnitModel, setShowUnitModel] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToLandscape();
    }, []),
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerUnitBtn}
          onPress={() => setShowUnitModel(true)}>
          <Icon name="package-variant" size={20} color="#fff" />
          <Title style={{marginLeft: 6, color: '#fff', fontSize: 14, fontWeight: '500'}}>
            {selectedUnit
              ? selectedUnit?.name.toUpperCase()
              : 'Select Unit'.toUpperCase()}
          </Title>
        </TouchableOpacity>
      ),
    });
  }, [selectedUnit]);

  const fetchAllCategories = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.categories,
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
        },
      });
      if (response.data.success === true) {
        setCategories(response.data.data.categories);
      } else {
        console.log('failed', response.data);
      }
    } catch (error) {
      console.log('catch: ', error);
      Alert.alert('Error', error);
    }
    setLoading(false);
  };

  const UnitModel = () => (
    <Modal
      animationType="fade"
      transparent={false}
      onDismiss={() => setShowUnitModel(false)}
      visible={showUnitModel}
      contentContainerStyle={styles.modalContainerStyle}>
      <View style={styles.input_container}>
        <Text style={{marginBottom: 8}}>Select an Unit</Text>
        {units.map(unit => (
          <TouchableOpacity
            onPress={() => {
              setSelectedUnit(unit);
              setShowUnitModel(false);
              // if (selectedSubCategoryId) {
              //   getProductWithSubCategory(selectedSubCategoryId, unit._id);
              // }
            }}
            style={[
              styles.capture,
              {
                flexDirection: 'row',
                borderBottomWidth: 1,
                padding: 10,
                borderColor: '#f0f0f0',
              },
            ]}>
            <Icon
              name="folder-multiple-outline"
              style={{marginTop: 2}}
              size={16}
              color={theme.primaryColorDark}
            />
            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 14}}>
              {unit.name.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );

  const onExpandPress = async id => {
    if (id === expandedId) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.categoryContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={categories}
            renderItem={({item}) => (
              <CategoryRender
                selectedUnit={selectedUnit}
                onExpandPress={onExpandPress}
                isExpanded={expandedId === item?._id}
                setShowUnitModel={(showUnitModel, id) => {
                  setShowUnitModel(showUnitModel);
                  setSelectedSubCategoryId(id);
                }}
                getProduct={id => {
                  // getProductWithSubCategory(id, unit)
                  setSelectedSubCategoryId(id);
                }}
                item={item}
              />
            )}
            ListFooterComponent={<></>}
            ListFooterComponentStyle={{
              height: 40,
            }}
            keyExtractor={(_, index) => `key${index}`}
            key={'cat_list'}
          />
        </View>
        <SubCategoryItemList
          navigation={navigation}
          subCategoryId={selectedSubCategoryId}
          unit={selectedUnit}
        />
        <Portal>{UnitModel()}</Portal>
        {loading ? <LoadingView /> : null}
      </View>
    </>
  );
};

export default CategoryListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: colors.light,
  },

  headerUnitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: theme.primaryColor,
    marginHorizontal: 10,
  },
  categoryContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },

  modalContainerStyle: {
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 30,
    marginHorizontal: 120,
    borderRadius: 20,
  },
});

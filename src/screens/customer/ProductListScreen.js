import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../constants/theme';
import {useFocusEffect} from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import ProductTable from '../../components/product/ProductTable';
import KeyBoardView from '../../components/product/KeyBoardView';

const ProductListScreen = ({navigation, route}) => {
  const {item} = route.params;

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToLandscape();
    }, []),
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginRight: 20}}
            onPress={() => {
              navigation.navigate('CartScreen', {backto: 3});
            }}>
            <Icon name="cart-minus" size={25} color={theme.primaryColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ProductTable
        item={item}
      />

      <KeyBoardView item={item} />
    </View>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: '#fff',
  },
});

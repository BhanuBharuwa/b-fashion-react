import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {addToCarts} from '../../store/slices/order.slice';
import { colors } from '../../constants/theme';

const KeyBoardView = ({item}) => {
  const numberBtnArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  const dispatch = useDispatch();

  const { selectedItem, carts } = useSelector(state => state.cart)

  const handleRemove = () => {
    if (!selectedItem) {
      return;
    }
    const index = carts?.findIndex(i => i.id == selectedItem.id);
    let tempQty = 0;
    if (index !== -1) {
      tempQty = carts[index].quantity.toString();
    }
    if (tempQty) {
      tempQty = tempQty.slice(0, -1);
    }
    if (tempQty.length === 0) {
      tempQty = 0;
    }
    dispatch(
      addToCarts({
        id: selectedItem.id,
        _id: selectedItem._id,
        size: selectedItem.size,
        price: item.selling_price,
        size_group_id: item.size_group_id,
        name: selectedItem.name,
        parent_product_id: item._id,
        parent_product: item.name,
        unit: item.units,
        quantity: parseInt(tempQty),
      }),
    );
  };
  const handleUpdate = qty => {
    if (!selectedItem) {
      return;
    }
    const index = carts?.findIndex(i => i.id == selectedItem.id);
    var tempQty;
    if (index !== -1) {
      tempQty = JSON.stringify(carts[index].quantity) + qty;
    } else {
      tempQty = qty;
    }

    dispatch(
      addToCarts({
        id: selectedItem.id,
        _id: selectedItem._id,
        size: selectedItem.size,
        price: item.selling_price,
        size_group_id: item.size_group_id,
        parent_product_id: item._id,
        name: selectedItem.name,
        parent_product: item.name,
        unit: item.units,
        quantity: parseInt(tempQty),
      }),
    );
  };

  return (
    <View style={styles.keyboard_container}>
      {numberBtnArr.map(e => (
        <Button
          onPress={() => {
            handleUpdate(e);
          }}
          mode="elevated">
          {e}
        </Button>
      ))}
      <Button onPress={() => handleRemove()} mode="elevated">
        X
      </Button>
    </View>
  );
};

export default KeyBoardView;

const styles = StyleSheet.create({
  keyboard_container: {
    padding: 10,
    width: '100%',
    position: 'absolute',
    backgroundColor: colors.primary,
    bottom: 0,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
});

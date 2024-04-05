import {StyleSheet, View} from 'react-native';
import { Caption, Text, Title } from 'react-native-paper';
import { colors } from '../../constants/theme';

const ProductDetails = ({item, headerHeight}) => {
  return (
    <View style={[styles.outlet_container, {height: (headerHeight / 2)}]}>
      <View>
        <Text style={styles.text_style}>{item.name}</Text>
        <Caption style={styles.text_style}>{item.sub_category}</Caption>
      </View>
      <View>
        <Title style={styles.text_style}>INR {item.selling_price}</Title>
      </View>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  outlet_container: {
    height: 50,
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  text_style: {
    color: '#fff',
    fontWeight: '500',
  },
});

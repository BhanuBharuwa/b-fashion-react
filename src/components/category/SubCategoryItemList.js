import {ActivityIndicator, Divider, List, Text} from 'react-native-paper';
import useProduct from '../../screens/customer/hooks/useProduct';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, theme} from '../../constants/theme';
import { useEffect } from 'react';

const SubCategoryItemList = ({navigation, subCategoryId, unit}) => {

  const {getProductWithSubCategory, product, loading} = useProduct();

  useEffect(() => {
    if (unit) {
      getProductWithSubCategory(subCategoryId, unit._id);
    }
  }, [subCategoryId, unit])

  return (
    <View style={styles.porductContainer}>
      <Text style={styles.sectionTitle}>
        Products
      </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={product}
          keyExtractor={item => item._id}
          contentContainerStyle={{paddingHorizontal: 10}}
          ListEmptyComponent={() => <Text>No Product Found !!</Text>}
          renderItem={({item, index}) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ProductListScreen', {item});
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 5,
                  }}>
                  <Text>{item.name}</Text>
                  <Icon name="chevron-right" size={20} color={colors.dark} />
                </TouchableOpacity>
                {index === product.length - 1 ? null : <Divider bold={true} />}
              </>
            );
          }}
        />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} color={colors.primary} />
        </View>
      ) : null}
    </View>
  );
};

export default SubCategoryItemList;

const styles = StyleSheet.create({
  porductContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  sectionTitle: {
    color: colors.light,
    fontSize: 14,
    backgroundColor: colors.primary,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    textAlign: 'center',
    elevation: 1,
  },

  loadingContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

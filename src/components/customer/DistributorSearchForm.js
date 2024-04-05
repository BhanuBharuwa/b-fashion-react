import React, {memo, useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {
  Button,
  Divider,
  HelperText,
  Searchbar,
  Subheading,
} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../constants/theme';
import useAddCustomer from '../../screens/customer/hooks/useAddCustomer';

const DistributorSearchForm = ({
  distributorId,
  errors,
  onClearPress,
  onDistributorClick,
}) => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const {distributors, formik, hasMore, fetchDistributors} = useAddCustomer();

  const {isSubmitting} = formik;

  useEffect(() => {
    fetchDistributors(1, '');
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={distributors}
        contentContainerStyle={styles.list}
        refreshing={false}
        ListHeaderComponent={
          <>
            <Searchbar
              value={query}
              onChangeText={text => {
                setQuery(text);
                setPage(1);
                fetchDistributors(1, text);
              }}
              loading={isSubmitting}
              placeholder="Search by name"
              style={styles.searchbar}
            />
            <View style={styles.top}>
              <Button onPress={onClearPress}>Clear</Button>
            </View>
            {errors.distributor_id && (
              <HelperText type="error">{errors.distributor_id}</HelperText>
            )}
          </>
        }
        onRefresh={() => {
          setPage(1);
          fetchDistributors(1, query);
        }}
        renderItem={({item}) => (
          <Pressable
            style={styles.item}
            onPress={() => onDistributorClick(item._id)}>
            <View style={styles.row}>
              <Subheading style={styles.text}>{item.name}</Subheading>
              {distributorId === item._id && (
                <MaterialIcon name="done" size={22} />
              )}
            </View>
            <Divider />
            <Divider />
            <Divider />
          </Pressable>
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!isSubmitting && hasMore) {
            fetchDistributors(page + 1, query);
            setPage(prev => prev + 1);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    marginVertical: 10,
    backgroundColor: colors.light,
    borderRadius: 10,
  },
  item: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontWeight: 'bold',
  },
  top: {
    alignItems: 'flex-end',
  },
  list: {
    paddingHorizontal: 2,
  },
});

export default memo(DistributorSearchForm);

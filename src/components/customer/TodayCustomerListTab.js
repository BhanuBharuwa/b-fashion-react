import {FlatList, View} from 'react-native';
import RenderSigleView from '../../screens/customer/CustomerListItem';
import EmptyCustomer from '../../svg/EmptyCustomer';
import {Text} from 'react-native-paper';
import {useState} from 'react';
import useCustomers from '../../screens/customer/hooks/useCustomers';

const TodayCustomerListTab = ({navigation, permissions}) => {
  const {todayCustomerData, isLoading} = useCustomers();

  const renderEmptyView = () => {
    return (
      <View style={styles.listItemContainer}>
        <EmptyCustomer />
        <Text style={styles.listItem}>Customer list is empty!</Text>
      </View>
    );
  };

  return (
    <View style={styles.list_item}>
      <CheckInCustomer />
      <FlatList
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyView()}
        data={todayCustomerData}
        keyExtractor={item => item._id}
        refreshing={isLoading}
        onRefresh={() => {
          customerVisitStatus();
          handleOnSubmit();
        }}
        renderItem={({item}) => {
          let statusColor = item.is_visited ? '#5cb85c' : '#d9534f';
          let visitedStatus = item.is_visited ? 'Visited' : 'Not Visited';
          let orderStatus = item.is_order_taken
            ? 'Order taken'
            : 'Order not taken';
          return (
            <RenderSigleView
              statusColor={statusColor}
              visitedStatus={visitedStatus}
              item={item}
              orderStatus={orderStatus}
              navigation={navigation}
              permissions={permissions}
              checkInCustomer={checkInCustomer}
            />
          );
        }}
      />
    </View>
  );
};

export default TodayCustomerListTab;

const styles = StyleSheet.create({
  list_item: {
    flex: 1,
    backgroundColor: 'white',
  },
  listItemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  listItem: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    color: 'gray',
  },
});

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {
  FAB,
  TouchableRipple,
  Chip,
  Searchbar,
  SegmentedButtons,
  Card,
} from 'react-native-paper';
import DraggablePanel from 'react-native-draggable-panel';
import SelectMultiple from 'react-native-select-multiple';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {TabView, SceneMap} from 'react-native-tab-view';

import {urls} from '../constants/urls';
import {colors, theme} from '../constants/theme';
import Divider from '../components/Divider';
import EmptyCustomer from '../svg/EmptyCustomer';

import {useFocusEffect} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import SegmentedControl from '../components/SegmentedControl';
import RenderSigleView from './customer/CustomerListItem';
const routess = [{key: 'area', title: 'Area'}];
const CustomersScreen = ({navigation}) => {
  const [customerData, setCustomer] = useState([]);
  const [todayCustomerData, setTodayCustomer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkInCustomer, setCheckInCustomer] = useState({});
  const [permissions, setPermissions] = useState({});
  const [customersFilter, setCustomersFilter] = useState([]);
  const [todayCustomersFilter, setTodayCustomersFilter] = useState([]);
  const [search, setSearch] = useState(false);
  const [areas, setAreas] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [value, setValue] = useState(0);
  //draggable filter states
  const initialLayout = {width: Dimensions.get('window').width};
  const [areasArray, setAreasArray] = useState([]);
  const [selected, setSelected] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [allTodayCustomers, setAllTodayCustomers] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [indexs, setIndexs] = React.useState(0);

  useEffect(() => {
    permissionDetail();
    fetchAllAreas().then(areas => {
      let tmp_arr = areas.map(area => {
        return {label: area.name, value: area._id};
      });
      setAreasArray(tmp_arr);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      customerVisitStatus();
      getCustomerList();
      getTodaysCustomerList();
    }, []),
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => setSearch(true)}
            style={{marginRight: 10}}>
            <Icon name="magnify" size={25} color={theme.primaryColor} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsFilterVisible(true)}
            style={{marginRight: 10}}>
            <Icon name="filter-variant" size={25} color={theme.primaryColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  async function permissionDetail() {
    const pers = await AsyncStorage.getItem('permission');
    setPermissions(JSON.parse(pers));
  }

  const fetchAllAreas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.areas,
        method: 'GET',
        headers: {
          'x-auth': token,
          'Content-type': 'application/json',
          version: '1',
        },
      });

      if (response.data.success) {
        setAreas(response.data.data.areas);
        return response.data.data.areas;
      } else {
        console.log(response.data.errors);
      }
    } catch (error) {
      console.log('AddCustomerScreen/catch: ', error);
      Alert.alert('Error', error);
    }
  };

  const customerVisitStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.customerVisitStatus,
        method: 'GET',
        headers: {
          'x-auth': token,
          version: '1',
          'Content-type': 'application/json',
        },
      });

      if (response.data.success === true) {
        setCheckInCustomer(response.data.data);
      } else {
        console.log('failed', response.data);
      }
    } catch (error) {
      console.log('catch: ', error);
      Alert.alert('Error', error);
    }
  };

  const getTodaysCustomerList = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.customers + '/today',
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
        },
      });
      if (response.data.success === true) {
        setIsLoading(false);
        setTodayCustomer(response.data.data.customers);
        setAllTodayCustomers(response.data.data.customers);
        setTodayCustomersFilter(response.data.data.customers);
      } else {
        setIsLoading(false);
        if (response.data.errors.token === 'token_invalid') {
          AsyncStorage.clear();
          navigation.navigate('AuthStack');
          navigation.closeDrawer();
          Alert.alert('Error', 'Login form another devices');
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Catch/getCustomerList: ', error);
      Alert.alert('Error', error);
    }
  };

  const getCustomerList = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.customers,
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
        },
      });
      if (response.data.success === true) {
        console.log(response.data.data.customers);

        setIsLoading(false);
        setCustomer(response.data.data.customers);
        setAllCustomers(response.data.data.customers);
        setCustomersFilter(response.data.data.customers);
      } else {
        setIsLoading(false);
        if (response.data.errors.token === 'token_invalid') {
          AsyncStorage.clear();
          navigation.navigate('AuthStack');
          navigation.closeDrawer();
          Alert.alert('Error', 'Login form another devices');
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Catch/getCustomerList: ', error);
      Alert.alert('Error', error);
    }
  };

  const searchCustomer = val => {
    const data = customersFilter.filter(
      item => `${item.name.toLowerCase()}`.indexOf(val.toLowerCase()) !== -1,
    );
    const datas = todayCustomersFilter.filter(
      item => `${item.name.toLowerCase()}`.indexOf(val.toLowerCase()) !== -1,
    );
    setCustomer(data);
    setTodayCustomer(datas);
  };

  const renderEmptyView = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}>
        <EmptyCustomer />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 15,
            color: 'gray',
          }}>
          Customer list is empty!
        </Text>
      </View>
    );
  };

  function onSelectionsChange(selectedAreas) {
    setSelected(selectedAreas);
  }

  function handleOnSubmit() {
    const tmp_areas = selected.map(item => item.value);
    const tmp_array = allCustomers.filter(item =>
      tmp_areas.includes(item.area_id),
    );
    const tmp_arrays = allTodayCustomers.filter(item =>
      tmp_areas.includes(item.area_id),
    );

    selected.length > 0 && setCustomer(tmp_array);
    selected.length > 0 && setTodayCustomer(tmp_arrays);
    setIsFilterVisible(false);
  }

  useEffect(() => {
    if (isAllSelected) {
      setSelected(areasArray);
    } else {
      setSelected([]);
    }
  }, [isAllSelected]);

  useEffect(() => {
    if (selected.length === areas.length) {
      setIsAllSelected(true);
    }

    if (selected.length === 0) {
      setIsAllSelected(false);
    }
  }, [selected]);

  const todayCustomerListTab = () => (
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
  const CheckInCustomer = () => (
    <>
      {checkInCustomer.status && !search ? (
        <>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              backgroundColor: '#CFDBC5',
              marginVertical: 10,
              borderRadius: 8,
            }}>
            <View style={{flex: 1}}>
              <Text style={[styles.title, {color: 'green'}]}>
                {checkInCustomer.customer_name}
              </Text>
              <Text>{checkInCustomer.customer_address}</Text>
            </View>

            <Text
              style={{
                fontWeight: 'bold',
                color: 'green',
                textAlign: 'center',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: 'green',
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}>
              Checked in
            </Text>
          </TouchableOpacity>
          <Divider />
        </>
      ) : null}
    </>
  );
  const customerListTab = () => (
    <View style={styles.list_item}>
      <CheckInCustomer />
      <FlatList
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyView()}
        data={customerData}
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
              navigation={navigation}
              permissions={permissions}
              checkInCustomer={checkInCustomer}
              statusColor={statusColor}
              visitedStatus={visitedStatus}
              item={item}
              orderStatus={orderStatus}
            />
          );
        }}
      />
    </View>
  );
  const AreaTab = () => (
    <ScrollView>
      <TouchableRipple
        style={{
          backgroundColor: theme.primaryColor,
          width: '20%',
          borderRadius: 5,
          padding: 8,
          margin: 8,
          alignSelf: 'flex-end',
        }}
        onPress={handleOnSubmit}>
        <Text style={{color: 'white', textAlign: 'center', fontWeight: '600'}}>
          Done
        </Text>
      </TouchableRipple>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 10,
          backgroundColor: '#FFF',
        }}>
        <Chip
          mode="flat"
          textStyle={{color: 'white'}}
          selectedColor="white"
          selected={isAllSelected}
          onPress={() => setIsAllSelected(!isAllSelected)}>
          {' '}
          All
        </Chip>
      </View>
      <SelectMultiple
        items={areasArray}
        selectedItems={selected}
        onSelectionsChange={onSelectionsChange}
      />
    </ScrollView>
  );

  const renderScenes = SceneMap({
    area: AreaTab,
  });

  return (
    <View style={styles.container}>
      {search ? (
        <View style={{flexDirection: 'row'}}>
          <Searchbar
            style={styles.searchtextinput}
            placeholder="Search customers..."
            onChangeText={val => {
              searchCustomer(val);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setSearch(false);
            }}
            style={styles.button}>
            <Text style={{color: 'white'}}>Done</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <SegmentedControl
        tabs={['Planned', 'All Customer']}
        currentIndex={value}
        segmentedControlBackgroundColor={colors.primary}
        activeTextColor={colors.primary}
        textColor={colors.light}
        onChange={setValue}
        marginVertical={1}
      />
      {/* <SegmentedButtons
        value={value}
        style={{
          width: 250,
          alignSelf: 'center',
          marginVertical: 10, 
        }}
        onValueChange={setValue}
        buttons={[
          {
            value: 'plan',
            label: 'Planned',
          },
          {
            value: 'all',
            label: 'All Customer',
          },
        ]}
      /> */}
      {value === 0 ? todayCustomerListTab() : customerListTab()}

      <DraggablePanel
        visible={isFilterVisible}
        onDismiss={() => setIsFilterVisible(false)}
        expandable={true}>
        <View style={styles.container}>
          <TabView
            lazy={true}
            navigationState={{index: indexs, routes: routess}}
            renderScene={renderScenes}
            onIndexChange={setIndexs}
            initialLayout={initialLayout}
          />
        </View>
      </DraggablePanel>
    </View>
  );
};
export default CustomersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  head_title: {
    marginStart: 10,
    marginTop: 2,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  searchtextinput: {
    flex: 1,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  button: {
    backgroundColor: theme.primaryColor,
    padding: 10,
    margin: 5,
    right: 5,
  },
  vender_name: {
    marginStart: 5,
    fontWeight: 'bold',
  },
  list_item: {
    flex: 1,
    backgroundColor: 'white',
  },
  vender: {
    flexDirection: 'row',
  },

  icon: {
    marginStart: 10,
    marginEnd: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkbox: {
    position: 'absolute',
    right: 20,
  },

  fab: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.primaryColor,
  },
});

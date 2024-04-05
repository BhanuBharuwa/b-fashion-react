import {View, Text} from 'react-native';
import React from 'react';
import {createNativeWrapper} from 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import AddCustomerScreen from '../screens/customer/AddCustomerScreen';
import HeaderTitle from '../components/HeaderTitle';
import OpenDrawerButton from '../components/OpenDrawerButton';

const {Screen, Navigator} = createStackNavigator();

const AddCustomerNavigation = () => {
  const navigation = useNavigation();

  return (
    <Navigator>
      <Screen
        name="AddCustomerScreen"
        component={AddCustomerScreen}
        options={{
          headerTitle: () => <HeaderTitle title={'Add new customer'} />,
          headerLeft: () => <OpenDrawerButton navigation={navigation} />,
        }}
      />
    </Navigator>
  );
};

export default AddCustomerNavigation;

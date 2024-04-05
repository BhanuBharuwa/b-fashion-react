import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  ActivityStackNavigation,
  CustomersStackNavigation,
  OrdersStackNavigation,
  PaymentStackNavigation,
  NewsStackNavigation,
  ComplainStackNavigation,
  SettingsStackNavigation,
} from './RootStackNavigation';

import DrawerContents from './DrawerContents';
import AuthStack from './AuthStackNavigation';
import AttendanceScreen from '../screens/attendance/AttendanceScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyScheduleStackNavigation from './MyScheduleStackNavigation';
import CompAnalysisNavigation from './CompAnalysisNavigation';
import TeamPerformanceNavigation from './TeamPerformanceNavigation';
import AddCustomerScreen from '../screens/customer/AddCustomerScreen';
import HeaderTitle from '../components/HeaderTitle';
import OpenDrawerButton from '../components/OpenDrawerButton';
import {useNavigation} from '@react-navigation/native';
import AddCustomerNavigation from './AddCustomerNavigation';

const Drawer = createDrawerNavigator();

const DrawableStackNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="ActivityStack"
      backBehavior="initialRoute"
      drawerContent={props => <DrawerContents {...props} />}>

      <Drawer.Screen name="ComplainStack" component={ComplainStackNavigation} />

      <Drawer.Screen name="ActivityStack" component={ActivityStackNavigation} />
      
      <Drawer.Screen
        name="CustomersStack"
        component={CustomersStackNavigation}
      />
      <Drawer.Screen name="SettingsStack" component={SettingsStackNavigation} />
      <Drawer.Screen name="OrdersStack" component={OrdersStackNavigation} />
      <Drawer.Screen
        name="MyScheduleStack"
        component={MyScheduleStackNavigation}
      />
      <Drawer.Screen name="PaymentStack" component={PaymentStackNavigation} />
      <Drawer.Screen name="NewsStack" component={NewsStackNavigation} />
      <Drawer.Screen name="AttendanceScreen" component={AttendanceScreen} />
      <Drawer.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
      <Drawer.Screen name="AuthStack" component={AuthStack} />
      <Drawer.Screen
        name="CompetitiveAnalysisStack"
        component={CompAnalysisNavigation}
      />
      <Drawer.Screen
        name="TeamPerformanceStack"
        component={TeamPerformanceNavigation}
      />
      <Drawer.Screen
        name="AddCustomerNavigation"
        component={AddCustomerNavigation}
      />
    </Drawer.Navigator>
  );
};

export default DrawableStackNavigation;

import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import AttendanceScreen from '../screens/attendance/AttendanceScreen';
import DrawableStack from '../navigation/DrawableStackNavigation';
import WaitingScreen from '../screens/WaitingScreen';
import RootedScreen from '../screens/RootedScreen';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
  <RootStack.Navigator headerMode="none" initialRouteName="SplashScreen">
    <RootStack.Screen name="SplashScreen" component={SplashScreen} />
    <RootStack.Screen name="SignInScreen" component={SignInScreen} />
    <RootStack.Screen name="RootedScreen" component={RootedScreen} />
    <RootStack.Screen name="AttendanceScreen" component={AttendanceScreen} />
    <RootStack.Screen name="WaitingScreen" component={WaitingScreen} />
    <RootStack.Screen name="DrawableStack" component={DrawableStack} />
  </RootStack.Navigator>
);

export default RootStackScreen;

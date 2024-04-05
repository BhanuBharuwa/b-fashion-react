import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import HeaderTitle from '../components/HeaderTitle';
import OpenDrawerButton from '../components/OpenDrawerButton';
import TeamPerformanceScreen from '../screens/team_performance';
import SalesManagerScreen from '../screens/team_performance/SalesManagerScreen';

const {Screen, Navigator} = createStackNavigator();

export const TeamPerformanceNavigation = () => {
  const navigation = useNavigation();

  return (
    <Navigator>
      <Screen
        name="TeamPerformanceScreen"
        component={TeamPerformanceScreen}
        options={{
          headerTitle: () => <HeaderTitle title={'Performance'} />,
          headerLeft: () => <OpenDrawerButton navigation={navigation} />,
        }}
      />
      <Screen
        name="SalesManagerScreen"
        component={SalesManagerScreen}
        options={{
          headerTitle: () => <HeaderTitle title={'Sales Managers Orders'} />,
        }}
      />
    </Navigator>
  );
};

export default TeamPerformanceNavigation;

import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import HeaderTitle from '../components/HeaderTitle';
import OpenDrawerButton from '../components/OpenDrawerButton';
import MyScheduleListScreen from '../screens/my_schedule';
import AddScheduleScreen from '../screens/my_schedule/AddScheduleScreen';
import MyScheduleDetailScreen from '../screens/my_schedule/MyScheduleDetailScreen';
import UpdateScheduleScreen from '../screens/my_schedule/UpdateScheduleScreen';

const {Screen, Navigator} = createStackNavigator();

const MyScheduleStackNavigation = () => {
  const navigation = useNavigation();

  return (
    <Navigator
      screenOptions={{animationEnabled: true, animationTypeForReplace: 'push'}}>
      <Screen
        name="MyScheduleListScreen"
        component={MyScheduleListScreen}
        options={{
          headerTitle: () => <HeaderTitle title={'My schedules'} />,
          headerLeft: () => <OpenDrawerButton navigation={navigation} />,
        }}
      />
      <Screen
        name="AddScheduleScreen"
        component={AddScheduleScreen}
        options={{
          headerTitle: () => <HeaderTitle title={'Add new schedule'} />,
        }}
      />
      <Screen
        name="MyScheduleDetailScreen"
        component={MyScheduleDetailScreen}
        options={{
          headerTitle: () => <HeaderTitle title={'Schedule details'} />,
        }}
      />
      <Screen
        name="UpdateScheduleScreen"
        component={UpdateScheduleScreen}
        options={{
          headerTitle: () => <HeaderTitle title={'Update schedule'} />,
        }}
      />
    </Navigator>
  );
};

export default MyScheduleStackNavigation;

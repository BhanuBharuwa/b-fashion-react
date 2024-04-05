import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import HeaderTitle from '../components/HeaderTitle';
import OpenDrawerButton from '../components/OpenDrawerButton';
import AddCompProductScreen from '../screens/comp_analysis';

const {Screen, Navigator} = createStackNavigator();

export const CompAnalysisNavigation = () => {
  const navigation = useNavigation();

  return (
    <Navigator>
      <Screen
        name="AddCompProductScreen"
        component={AddCompProductScreen}
        options={{
          headerTitle: () => <HeaderTitle title={'Add Details'} />,
          headerLeft: () => <OpenDrawerButton navigation={navigation} />,
        }}
      />
    </Navigator>
  );
};

export default CompAnalysisNavigation;

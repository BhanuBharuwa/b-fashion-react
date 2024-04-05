import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
//activity
import ActivityScreen from '../screens/ActivityScreen';
//customer
import CustomersScreen from '../screens/CustomersScreen';
import CustomerDetailScreen from '../screens/customer/CustomerDetailScreen';
import AddPaymentScreen from '../screens/customer/AddPaymentScreen';
import UpdateCustomerScreen from '../screens/customer/UpdateCustomerScreen';
import CategoryListScreen from '../screens/customer/category/CategoryListScreen';
import SubCategoryListScreen from '../screens/customer/SubCategoryListScreen';
import BrandListScreen from '../screens/customer/BrandListScreen';
import CartScreen from '../screens/customer/CartScreen';
import AddCustomerScreen from '../screens/customer/AddCustomerScreen';
import ProductListScreen from '../screens/customer/ProductListScreen';
import UpdateLocation from '../screens/customer/UpdateLocation';
import RecentPaymentScreen from '../screens/customer/RecentPaymentScreen';
import RecentOrderScreen from '../screens/customer/RecentOrderScreen';

//orders
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/order/OrderDetailScreen';

//payment
import PaymentScreen from '../screens/PaymentScreen';
import PaymentDetailScreen from '../screens/payment/PaymentDetailScreen';

//complain
import ComplainScreen from '../screens/ComplainScreen';
import ViewComplainScreen from '../screens/complain/ViewComplainScreen';
//news
import NewsScreen from '../screens/NewsScreen';
import NewsDetailScreen from '../screens/news/NewsDetailScreen';

//setting
import SettingsScreen from '../screens/SettingsScreen';
import AppHealthScreen from '../screens/settings/AppHealthScreen';
import ContactUsScreen from '../screens/settings/ContactUsScreen';
import ChangePasswordScreen from '../screens/settings/ChangePasswordScreen';

import OpenDrawerButton from '../components/OpenDrawerButton';
import HeaderTitle from '../components/HeaderTitle';
import ProfileScreen from '../screens/ProfileScreen';
import OutstandingBillScreen from '../screens/customer/OutstandingBillScreen';
import AddComplainScreen from '../screens/customer/AddComplainScreen';
import MiniStatement from '../screens/customer/MiniStatementScreen';
import ActivityLogScreen from '../screens/activity/ActivityLogScreen';
import DistributorsScreen from '../screens/customer/DistributorsScreen';
import SurveyScreen from '../screens/customer/SurveyScreen';

const ActivityStack = createStackNavigator();
export const ActivityStackNavigation = ({navigation}) => (
  <ActivityStack.Navigator>
    <ActivityStack.Screen
      name="ActivityScreen"
      component={ActivityScreen}
      options={{
        headerTitle: () => <HeaderTitle title={"Today's report"} />,
        headerLeft: () => <OpenDrawerButton navigation={navigation} />,
      }}
    />

    <ActivityStack.Screen
      name="ActivityLog"
      component={ActivityLogScreen}
      options={{
        headerTitle: () => <HeaderTitle title={'Activity Log'} />,
      }}
    />
  </ActivityStack.Navigator>
);

const CustomersStack = createStackNavigator();
export const CustomersStackNavigation = ({navigation}) => (
  <CustomersStack.Navigator>
    <CustomersStack.Screen
      name="CustomersScreen"
      component={CustomersScreen}
      options={{
        headerTitle: () => <HeaderTitle title={'Customers'} />,
        headerLeft: () => <OpenDrawerButton navigation={navigation} />,
      }}
    />
    <CustomersStack.Screen
      name="CustomerDetailScreen"
      options={{title: 'Customer Details'}}
      component={CustomerDetailScreen}
    />
    <CustomersStack.Screen
      name="DistributorsScreen"
      options={{title: 'Select distributor'}}
      component={DistributorsScreen}
    />
    <CustomersStack.Screen
      name="UpdateCustomerScreen"
      options={{title: 'Update Customer Detail'}}
      component={UpdateCustomerScreen}
    />

    <CustomersStack.Screen
      name="AddPaymentScreen"
      options={{title: 'Customer Payment'}}
      component={AddPaymentScreen}
    />
    <CustomersStack.Screen
      name="ProductListScreen"
      options={{title: 'Product List'}}
      component={ProductListScreen}
    />
    <CustomersStack.Screen
      name="CategoryListScreen"
      options={{title: 'Product'}}
      component={CategoryListScreen}
    />
    <CustomersStack.Screen
      name="BrandListScreen"
      options={{title: 'Brand List'}}
      component={BrandListScreen}
    />
    <CustomersStack.Screen
      name="SubCategoryListScreen"
      options={{title: 'Sub-Category List'}}
      component={SubCategoryListScreen}
    />
    <CustomersStack.Screen
      name="SurveyScreen"
      options={{headerShown: false}}
      component={SurveyScreen}
    />
    <CustomersStack.Screen
      name="CartScreen"
      options={{title: 'Order Confirmation'}}
      component={CartScreen}
    />
    <CustomersStack.Screen
      name="UpdateLocation"
      options={{title: 'Customer Location'}}
      component={UpdateLocation}
    />
    <CustomersStack.Screen
      name="RecentPaymentScreen"
      options={{title: 'Recent Payment'}}
      component={RecentPaymentScreen}
    />
    <CustomersStack.Screen
      name="RecentOrderScreen"
      options={{title: 'Recent Order'}}
      component={RecentOrderScreen}
    />
    <CustomersStack.Screen
      name="OutstandingBillScreen"
      options={{title: 'Outstanding bills'}}
      component={OutstandingBillScreen}
    />
    <CustomersStack.Screen
      name="MiniStatementScreen"
      options={{title: 'Mini-Statement'}}
      component={MiniStatement}
    />
    <CustomersStack.Screen
      name="AddComplainScreen"
      options={{title: 'Add complaint'}}
      component={AddComplainScreen}
    />
  </CustomersStack.Navigator>
);

const OrdersStack = createStackNavigator();
export const OrdersStackNavigation = ({navigation}) => (
  <OrdersStack.Navigator>
    <OrdersStack.Screen
      name="OrdersScreen"
      component={OrdersScreen}
      options={{
        headerTitle: () => <HeaderTitle title={'Orders'} />,
        headerLeft: () => <OpenDrawerButton navigation={navigation} />,
      }}
    />
    <OrdersStack.Screen
      name="OrderDetailScreen"
      options={{title: 'Order Detail'}}
      component={OrderDetailScreen}
    />
  </OrdersStack.Navigator>
);

const PaymentStack = createStackNavigator();
export const PaymentStackNavigation = ({navigation}) => (
  <PaymentStack.Navigator>
    <PaymentStack.Screen
      name="PaymentScreen"
      component={PaymentScreen}
      options={{
        headerTitle: () => <HeaderTitle title={'Payment'} />,
        headerLeft: () => <OpenDrawerButton navigation={navigation} />,
      }}
    />
    <PaymentStack.Screen
      name="PaymentDetailScreen"
      options={{title: 'Payment Detail'}}
      component={PaymentDetailScreen}
    />
  </PaymentStack.Navigator>
);

const NewsStack = createStackNavigator();
export const NewsStackNavigation = ({navigation}) => (
  <NewsStack.Navigator>
    <NewsStack.Screen
      name="NewsScreen"
      component={NewsScreen}
      options={{
        headerTitle: () => <HeaderTitle title={'News'} />,
        headerLeft: () => <OpenDrawerButton navigation={navigation} />,
      }}
    />
    <NewsStack.Screen
      name="NewsDetailScreen"
      component={NewsDetailScreen}
      options={{title: 'News Details'}}
    />
  </NewsStack.Navigator>
);

const ComplainStack = createStackNavigator();
export const ComplainStackNavigation = ({navigation}) => (
  <ComplainStack.Navigator>
    <ComplainStack.Screen
      name="ComplainScreen"
      component={ComplainScreen}
      options={{
        headerTitle: () => <HeaderTitle title={'Compalints'} />,
        headerLeft: () => <OpenDrawerButton navigation={navigation} />,
      }}
    />
    <ComplainStack.Screen
      name="ViewComplainScreen"
      component={ViewComplainScreen}
      options={{title: 'Compalint Details'}}
    />
  </ComplainStack.Navigator>
);

const SettingsStack = createStackNavigator();
export const SettingsStackNavigation = ({navigation}) => (
  <SettingsStack.Navigator initialRouteName="SettingsScreen">
    <SettingsStack.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={{
        headerTitle: () => <HeaderTitle title={'Settings'} />,
        headerLeft: () => <OpenDrawerButton navigation={navigation} />,
      }}
    />

    <SettingsStack.Screen
      name="AppHealthScreen"
      options={{title: 'App Health'}}
      component={AppHealthScreen}
    />
    <SettingsStack.Screen
      name="ContactUsScreen"
      options={{title: 'Contact Us'}}
      component={ContactUsScreen}
    />
    <SettingsStack.Screen
      name="ChangePasswordScreen"
      options={{title: 'Change Password'}}
      component={ChangePasswordScreen}
    />
  </SettingsStack.Navigator>
);

// const ProfileStack = createStackNavigator()
// export const profileStackNavigator = () => {
//     <ProfileStack.Navigator initialRouteName={'ProfileScreen'}>
//         <ProfileStack.Screen
//             name={'ProfileScreen'}
//             component={ProfileScreen}
//             options={{title: 'Profile'}}
//         />
//     </ProfileStack.Navigator>
// }

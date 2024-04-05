import React, {useEffect, useState} from 'react';
import {StatusBar, View, Text, Alert} from 'react-native';
import {Provider as StoreProvider} from 'react-redux';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import AuthStackNavigation from './src/navigation/AuthStackNavigation';
import codePush from 'react-native-code-push';
import {Provider as PaperProvider} from 'react-native-paper';
import {theme} from './src/constants/theme';
import {themes} from './src/constants/themeProvider';

import store from './src/store';
// const codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};

const App = () => {
  const [internet, isInternet] = useState('');

  useEffect(() => {
    // codePush.sync({
    //   updateDialog: false,
    //   installMode: codePush.InstallMode.IMMEDIATE,
    // });
    NetInfo.fetch().then(state => {
      isInternet(state.isConnected);
    });
  }, []);

  return (
      <StoreProvider store={store}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={theme.primaryColor}
      />
      {internet ? null : (
        <View
          style={{alignItems: 'center', width: '100%', backgroundColor: 'red'}}>
          <Text style={{color: 'white'}}>No Internet Connection</Text>
        </View>
      )}
      <PaperProvider theme={themes}>
        <NavigationContainer>
          <AuthStackNavigation />
        </NavigationContainer>
      </PaperProvider>
      </StoreProvider>
  );
};

export default App

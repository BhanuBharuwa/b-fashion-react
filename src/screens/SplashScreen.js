import AsyncStorage from '@react-native-community/async-storage';
import {useTheme} from '@react-navigation/native';
import axios from 'axios';
import MapmyIndiaIntouch from 'mappls-intouch-react-native';
import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {urls} from '../constants/urls';
import JailMonkey from 'jail-monkey';
import { colors } from '../constants/theme';

const SplashScreen = ({navigation}) => {
  const {colors} = useTheme();
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    setTimeout(() => {
      if (JailMonkey.isJailBroken()) {
        navigation.navigate('RootedScreen');
        return;
      }
      permissionDetail();
      checkLogIn();
    }, 2000);
  }, []);
  async function permissionDetail() {
    const pers = await AsyncStorage.getItem('permission');
    setPermissions(JSON.parse(pers));
  }

  const checkPunchStatus = async token => {
    try {
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.punchStatus,
        method: 'GET',
        headers: {
          version: '1',
          'x-auth': token,
        },
      });
      if (response.data.success === true) {
        if (response.data.data.status) {
          MapmyIndiaIntouch.startTracking();
          navigation.navigate('DrawableStack');
        } else {
          navigation.navigate('AttendanceScreen', {stack: true});
        }
      } else {
        if (response.data.errors.token === 'token_invalid') {
          AsyncStorage.clear();
          navigation.navigate('SignInScreen');
          navigation.closeDrawer();
          Alert.alert('Error', 'Login form another devices');
        }
      }
    } catch (error) {
      console.log('drawer content ', error);
      navigation.navigate('SignInScreen');
    }
  };
  const checkLogIn = async () => {
    const token = await AsyncStorage.getItem('token');

    if (token === null) {
      navigation.navigate('SignInScreen');
    } else {
      if (permissions['punch-in-out-api'] == true) {
        checkPunchStatus(token);
      } else {
        navigation.navigate('DrawableStack');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          duraton="1500"
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* <Animatable.Text
                    animation="fadeInUpBig"
                    style={styles.title}>B-Force</Animatable.Text> */}
      </View>
    </View>
  );
};

export default SplashScreen;

const {height} = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  logo: {
    width: '80%',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#00B0F7',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },

  title: {
    color: '#00B0F7',
    fontSize: 30,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    marginTop: 5,
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
  },
});

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {theme} from '../constants/theme';
import {urls} from '../constants/urls';
import {useTheme} from 'react-native-paper';
import LoadingScreen from '../components/LoadingScreen';
import VersionNumber from 'react-native-version-number';

const SignInScreen = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = React.useState({
    username: '',
    password: '',
    company: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const companyRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [companyError, setCompanyError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const {colors} = useTheme();

  const textInputChange = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };
  const CompanyInputChange = val => {
    setData({
      ...data,
      company: val,
    });
  };

  useEffect(() => {
    alert(
      'This app collects location data to show your location to your company even when the app is closed or not in use.',
    );

    const backAction = () => {
      Alert.alert('Exit!', 'Are you sure you want to exit app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  const handlePasswordChange = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidUser = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

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
          navigation.navigate('DrawableStack');
          setVisible(false);
        } else {
          navigation.navigate('AttendanceScreen', {stack: true});
          setVisible(false);
        }
      }
    } catch (error) {
      console.log('drawer content ', error);
      setVisible(false);
    }
  };

  const fetchAccountDetails = async (token, permissions) => {
    try {
      const company = await AsyncStorage.getItem('url');
      const response = await axios({
        url: urls.prefix + company + urls.profile,
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'x-auth': token,
          version: '1',
        },
      });

      if (response.data.success === true) {
        const jsonValue = JSON.stringify(response.data.data);
        await AsyncStorage.setItem('profile', jsonValue);
        if (permissions['punch-in-out-api'] == true) {
          checkPunchStatus(token);
        } else {
          navigation.navigate('DrawableStack');
        }
      } else {
        Alert.alert('', response.data.errors);
        console.log('Profile: ', response.data.errors);
      }
    } catch (error) {
      console.log('catchs: ', error);
      Alert.alert('Error', 'Failed to log in!');
    }
  };

  const validate = () => {
    let count = 0;

    if (!data.company || data.company === '') {
      setCompanyError('Company name cannot be empty');
      count++;
    }

    if (!data.password || data.password === '') {
      setUsernameError('Username cannot be empty');
      count++;
    }

    if (!data.password || data.password === '') {
      setPasswordError('Password cannot be empty');
      count++;
    }

    return count;
  };

  const loginHandle = async (userName, password, company) => {
    if (validate() !== 0) {
      return;
    }

    setVisible(true);

    setCompanyError('');
    setUsernameError('');
    setPasswordError('');

    try {
      var url = '';
      if (company == 'passifrozenfoods') {
        await AsyncStorage.setItem('url', 'newmahalaxmi');
        url = urls.prefix + 'newmahalaxmi' + urls.login;
      } else {
        await AsyncStorage.setItem('url', company);
        url = urls.prefix + company + urls.login;
      }
      const response = await axios({
        url: url,
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        data: {
          email: userName,
          password,
        },
      });

      if (response.data.success === true) {
        if (response.data.data.permissions['login-api'] == true) {
          setVisible(false);
          const {token} = response.data.data;
          await AsyncStorage.setItem('token', token);
          const jsonValue = JSON.stringify(response.data.data.permissions);
          await AsyncStorage.setItem('permission', jsonValue);
          fetchAccountDetails(token, response.data.data.permissions);
        } else {
          setVisible(false);
          navigation.navigate('WaitingScreen');
        }
      } else {
        setVisible(false);
        Alert.alert('', response.data.errors.email);
      }
    } catch (error) {
      setVisible(false);
      console.log('catch: ', error?.response);
      console.log('catch: ', error);
      Alert.alert('Error', 'Failed to log in!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>

      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={[
              styles.text_footer,
              {
                color: '#000',
              },
            ]}>
            Company Name
          </Text>
          <View style={styles.action}>
            <FontAwesome name="building-o" color={colors.text} size={20} />
            <TextInput
              placeholder="Your Company Name"
              placeholderTextColor="#666666"
              style={[
                styles.textInput,
                {
                  color: '#000',
                },
              ]}
              autoCapitalize="none"
              onChangeText={val => CompanyInputChange(val)}
              ref={companyRef}
            />
          </View>

          {!companyError ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{companyError}</Text>
            </Animatable.View>
          )}

          <Text
            style={[
              styles.text_footer,
              {
                color: '#000',
              },
            ]}>
            Username
          </Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color={colors.text} size={20} />
            <TextInput
              placeholder="Your Username"
              placeholderTextColor="#666666"
              style={[
                styles.textInput,
                {
                  color: '#000',
                },
              ]}
              autoCapitalize="none"
              onChangeText={val => textInputChange(val)}
              onEndEditing={e => handleValidUser(e.nativeEvent.text)}
              ref={usernameRef}
            />
            {data.check_textInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          {!usernameError ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{usernameError}</Text>
            </Animatable.View>
          )}
          {data.isValidUser ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Username must be at least 4 characters long.
              </Text>
            </Animatable.View>
          )}

          <Text
            style={[
              styles.text_footer,
              {
                color: '#000',
              },
            ]}>
            Password
          </Text>
          <View style={styles.action}>
            <Feather name="lock" color={colors.text} size={20} />
            <TextInput
              placeholder="Your Password"
              placeholderTextColor="#666666"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={[
                styles.textInput,
                {
                  color: '#000',
                },
              ]}
              autoCapitalize="none"
              onChangeText={val => handlePasswordChange(val)}
              ref={passwordRef}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {data.isValidPassword ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Password must be at least 4 characters long.
              </Text>
            </Animatable.View>
          )}
          {!passwordError ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{passwordError}</Text>
            </Animatable.View>
          )}

          <TouchableOpacity>
            <Text style={{color: theme.primaryColorDark, marginTop: 15}}>
              Forgot password?
            </Text>
          </TouchableOpacity>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => {
                loginHandle(data.username, data.password, data.company);
              }}>
              <LinearGradient
                colors={[theme.primaryColorDark, theme.primaryColor]}
                style={styles.signIn}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Sign In
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={{alignSelf: 'center', marginTop: 10}}>
              Version: {VersionNumber.appVersion} ({VersionNumber.buildVersion})
            </Text>
          </View>
        </ScrollView>
      </Animatable.View>
      <LoadingScreen visible={visible} text="Checking Login Credential" />
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

import React, {useEffect} from 'react';
import {BackHandler, Image, StyleSheet, View} from 'react-native';
import {Title} from 'react-native-paper';

const RootedScreen = () => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () =>
      BackHandler.exitApp(),
    );

    return () => BackHandler.removeEventListener('hardwareBackPress');
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/rooted.png')}
        style={styles.img}
      />
      <Title style={styles.title}>
        Jailbroken or rooted device detected. You cannot use the app on this
        device.
      </Title>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  img: {
    height: 200,
    width: 200,
  },
  title: {
    textAlign: 'justify',
    fontSize: 14,
  },
});

export default RootedScreen;

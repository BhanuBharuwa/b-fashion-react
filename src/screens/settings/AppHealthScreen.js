import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const AppHealthScreen = () => {
  const [internet, isInternet] = useState('');
  const [gps, isGps] = useState('');

  useEffect(() => {
    NetInfo.fetch().then(state => {
      isInternet(state.isConnected);
    });
  });
  return (
    <View>
      <View style={styles.menu_item}>
        <Icon
          style={styles.icon}
          name="signal-variant"
          size={20}
          color="#000"
        />
        <Text style={styles.title}>INTERNET</Text>
        {internet == true ? (
          <Text style={[styles.value, {color: 'green'}]}>CONNECTED</Text>
        ) : (
          <Text style={[styles.value, {color: 'red'}]}>DISCONNECTED</Text>
        )}
      </View>
      {/* <View style={styles.menu_item}>
        <Icon
          style={styles.icon}
          name="map-marker-outline"
          size={20}
          color="#000"
        />
        <Text style={styles.title}>GPS</Text>
        {gps == true ? (
          <Text style={[styles.value, {color: 'green'}]}>ON</Text>
        ) : (
          <Text style={[styles.value, {color: 'red'}]}>OFF</Text>
        )}
      </View> */}
    </View>
  );
};

export default AppHealthScreen;
const styles = StyleSheet.create({
  menu_item: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 6,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },

  icon: {
    marginStart: 20,
    marginEnd: 20,
    opacity: 0.6,
  },

  title: {
    marginEnd: 80,
    fontSize: 14,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    position: 'absolute',
    right: 40,
    fontWeight: 'bold',
  },
});

import {View, StyleSheet, Dimensions, Pressable} from 'react-native';
import React from 'react';
import {colors} from '../../constants/theme';
import {Subheading, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const width = 0.75 * Dimensions.get('window').width;

const SalesTeamPerformance = () => {
  const {navigate} = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Subheading numberOfLines={1} style={styles.title}>
          Sales Manager Orders
        </Subheading>
        <Text style={styles.topText}>MTD</Text>
      </View>
      <Text style={styles.text}>Jenish Maharjan</Text>
      <View style={styles.row}>
        <View style={styles.bar}>
          <View
            style={{
              width: 0.8 * width,
              backgroundColor: colors.primary,
              height: 10,
            }}
          />
        </View>
        <Text style={styles.amt}>2000</Text>
      </View>
      <Text style={styles.text}>Jyoti Mishra</Text>
      <View style={styles.row}>
        <View style={styles.bar}>
          <View
            style={{
              width: 0.4 * width,
              backgroundColor: colors.primary,
              height: 10,
            }}
          />
        </View>
        <Text style={styles.amt}>1000</Text>
      </View>
      <Text style={styles.text}>Kushal Shrestha</Text>
      <View style={styles.row}>
        <View style={styles.bar}>
          <View
            style={{
              width: 0.6 * width,
              backgroundColor: colors.primary,
              height: 10,
            }}
          />
        </View>
        <Text style={styles.amt}>1500</Text>
      </View>
      <Pressable
        style={styles.footer}
        onPress={() => navigate('SalesManagerScreen')}>
        <Icon size={10} name="caretdown" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    elevation: 3,
    backgroundColor: colors.light,
    borderRadius: 5,
    marginVertical: 10,
  },
  top: {
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    letterSpacing: 1.2,
    fontSize: 14,
  },
  topText: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    opacity: 0.7,
    borderRadius: 10,
    color: colors.light,
  },
  text: {
    marginTop: 10,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amt: {
    paddingHorizontal: 5,
  },
  bar: {
    width: width,
    height: 10,
    backgroundColor: '#DAE0E5',
    borderRadius: 2,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SalesTeamPerformance;

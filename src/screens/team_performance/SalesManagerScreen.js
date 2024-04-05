import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import React from 'react';
import {colors} from '../../constants/theme';
import {Text} from 'react-native-paper';

const width = 0.75 * Dimensions.get('window').width;

const SalesManagerScreen = () => {
  return (
    <ScrollView style={styles.container}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.light,
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
});

export default SalesManagerScreen;

import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Subheading} from 'react-native-paper';

const FlatlistEmptyView = ({
  iconName = 'format-list-bulleted',
  text = 'No data found',
}) => {
  return (
    <View style={styles.container}>
      <Icon name={iconName} size={100} />
      <Subheading style={styles.text}>{text}</Subheading>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  text: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default FlatlistEmptyView;

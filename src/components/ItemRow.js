import {View, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'react-native-paper';

const size = 23;

const ItemRow = ({
  icon = true,
  iconName = 'chat-question',
  label = '',
  value = '',
  backGroundColor,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {icon && (
          <View style={[styles.iconView, {backgroundColor: backGroundColor}]}>
            <Icon name={iconName} color="white" size={size} />
          </View>
        )}
        <Text style={styles.text}>{label}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.text2}>{value ? value : 'N/A'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconView: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    borderRadius: 5,
  },
  left: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 10,
  },
});

export default ItemRow;

import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Subheading, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';

const AreaScheduleCard = ({item}) => {
  const {navigate} = useNavigation();

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigate('MyScheduleDetailScreen', {id: item._id, status: item.status})
      }>
      <View style={styles.top}>
        <Subheading style={styles.title}>
          {item.date ? moment(item.date).format('DD MMMM YYYY') : 'N/A'}
        </Subheading>
        <Text
          style={[
            styles.status,
            item.status === 'approved'
              ? styles.success
              : item.status === 'rejected'
              ? styles.rejected
              : styles.pending,
          ]}>
          {item.status === 'approved'
            ? 'Approved'
            : item.status === 'rejected'
            ? 'Rejected'
            : 'Pending'}
        </Text>
      </View>
      <View style={styles.row}>
        <Icon name="map-marker" color={colors.primary} size={22} />
        <Text style={styles.text}>{item.area_name ?? 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="comment" color={colors.primary} size={22} />
        <Text style={styles.text}>{item.remarks ?? 'N/A'}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 10,
    elevation: 3,
    backgroundColor: colors.light,
    borderRadius: 10,
  },
  top: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  status: {
    padding: 5,
    color: colors.light,
    borderRadius: 10,
  },
  success: {
    backgroundColor: colors.success,
  },
  pending: {
    backgroundColor: colors.accentPrimary,
  },
  rejected: {
    backgroundColor: colors.error,
  },
  row: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 5,
  },
});

export default AreaScheduleCard;

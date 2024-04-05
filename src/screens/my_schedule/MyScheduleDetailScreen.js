import {View, StyleSheet, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {colors} from '../../constants/theme';
import {ScrollView} from 'react-native-gesture-handler';
import useSchedule from './hooks/useSchedule';
import {Button, Divider, Subheading, Text} from 'react-native-paper';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingView from '../../components/LoadingView';

const MyScheduleDetailScreen = ({route, navigation}) => {
  const {id, status} = route.params;

  const {scheduleDetail, loading, fetchScheduleDetail, deleteAreaSchedule} =
    useSchedule();

  useEffect(() => {
    fetchScheduleDetail(id);
  }, []);

  const onDeletePress = () => {
    Alert.alert('Confirm', 'Proceed to delete the area schedule', [
      {
        text: 'Cancel',
      },
      {
        text: 'Confirm',
        onPress: () => deleteAreaSchedule(id),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.top}>
          <Subheading style={styles.title}>Schedule information</Subheading>
          <Text
            style={[
              styles.status,
              status === 'approved'
                ? styles.success
                : status === 'rejected'
                ? styles.rejected
                : styles.pending,
            ]}>
            {status === 'approved'
              ? 'Approved'
              : status === 'rejected'
              ? 'Rejected'
              : 'Pending'}
          </Text>
        </View>
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <View style={styles.row}>
          <View style={styles.left}>
            <View style={styles.subRow}>
              <Icon name="calendar" size={22} color={colors.primary} />
              <Text style={styles.text}>Date</Text>
            </View>
          </View>
          <View style={styles.mid}>
            <Text>:</Text>
          </View>
          <View style={styles.right}>
            <Text>
              {scheduleDetail.date
                ? moment(scheduleDetail.date).format('DD MMMM YYYY')
                : 'N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.left}>
            <View style={styles.subRow}>
              <Icon name="map-marker" size={22} color={colors.primary} />
              <Text style={styles.text}>Area</Text>
            </View>
          </View>
          <View style={styles.mid}>
            <Text>:</Text>
          </View>
          <View style={styles.right}>
            <Text>{scheduleDetail.area_name ?? 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.left}>
            <View style={styles.subRow}>
              <Icon name="comment" size={22} color={colors.primary} />
              <Text style={styles.text}>Remarks</Text>
            </View>
          </View>
          <View style={styles.mid}>
            <Text>:</Text>
          </View>
          <View style={styles.right}>
            <Text>{scheduleDetail.remarks ?? 'N/A'}</Text>
          </View>
        </View>
      </View>
      {status === 'pending' && (
        <>
          <Button
            buttonColor={colors.primary}
            labelStyle={styles.btnLabel}
            style={styles.btn}
            onPress={() =>
              navigation.navigate('UpdateScheduleScreen', {id, scheduleDetail})
            }>
            Update
          </Button>
          <Button
            buttonColor={colors.error}
            labelStyle={styles.btnLabel}
            style={styles.btn}
            onPress={onDeletePress}>
            Delete
          </Button>
        </>
      )}
      {loading && <LoadingView />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.light,
    flex: 1,
  },
  card: {
    padding: 10,
    marginVertical: 10,
    elevation: 3,
    backgroundColor: colors.light,
    borderRadius: 10,
  },
  top: {
    marginVertical: 10,
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
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mid: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 5,
  },
  btn: {
    marginVertical: 10,
  },
  btnLabel: {
    color: colors.light,
  },
});

export default MyScheduleDetailScreen;

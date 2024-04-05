import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants/theme';
import useSchedule from './hooks/useSchedule';
import {useIsFocused} from '@react-navigation/native';
import FlatlistEmptyView from '../../components/FlatlistEmptyView';
import FilterModal from '../../components/FilterModal';
import {useCallback} from 'react';
import moment from 'moment';
import AreaScheduleCard from '../../components/my_schedule/AreaScheduleCard';

const MyScheduleListScreen = ({navigation}) => {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.top}>
          <Icon
            name="filter-variant"
            size={22}
            color={colors.primary}
            style={styles.mainContainer}
            onPress={() => setVisible(true)}
          />
          <Icon
            name="plus"
            size={22}
            color={colors.primary}
            style={styles.mainContainer}
            onPress={() => navigation.navigate('AddScheduleScreen')}
          />
        </View>
      ),
    });
  }, []);

  const {loading, hasMore, areaScehdules, fetchAreaSchedules} = useSchedule();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchAreaSchedules(1, startDate, endDate);
    }

    return () => {
      setPage(1);
    };
  }, [isFocused]);

  const onStartDateChange = useCallback(
    date => {
      if (moment(date).isAfter(endDate)) {
        setEndDate(date);
      }

      setStartDate(date);
    },
    [startDate, endDate],
  );

  const onEndDatechange = useCallback(
    date => {
      if (moment(date).isBefore(startDate)) {
        setStartDate(date);
      }

      setEndDate(date);
    },
    [startDate, endDate],
  );

  const onOkClick = useCallback(() => {
    setVisible(false);
    setPage(1);

    fetchAreaSchedules(1, startDate, endDate);
  }, [startDate, endDate]);

  return (
    <View style={styles.container}>
      <FlatList
        data={areaScehdules}
        refreshing={loading}
        contentContainerStyle={styles.list}
        onRefresh={() => {
          setPage(1);
          fetchAreaSchedules(1, startDate, endDate);
        }}
        renderItem={({item}) => <AreaScheduleCard item={item} />}
        ListEmptyComponent={
          <FlatlistEmptyView
            iconName="calendar"
            text="No data found for the date range"
          />
        }
        onEndReached={() => {
          if (!loading && hasMore) {
            fetchAreaSchedules(page + 1, startDate, endDate);
            setPage(prev => prev + 1);
          }
        }}
      />
      <FilterModal
        visible={visible}
        startDate={startDate}
        endDate={endDate}
        onOkClick={onOkClick}
        onStartDateChange={onStartDateChange}
        onEndDatechange={onEndDatechange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 8,
  },
  top: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  list: {
    padding: 10,
  },
});

export default MyScheduleListScreen;

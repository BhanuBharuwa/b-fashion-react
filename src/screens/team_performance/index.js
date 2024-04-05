import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {colors} from '../../constants/theme';
import SummaryCard from '../../components/team_performance/SummaryCard';
import SalesTeamPerformance from '../../components/team_performance/SalesTeamPerformance';
import OutletSummary from '../../components/team_performance/OutletSummary';
import {useLayoutEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OrderSummary from '../../components/team_performance/OrderSummary';

const TeamPerformanceScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="filter-variant"
          size={25}
          color={colors.primary}
          style={styles.icon}
        />
      ),
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SummaryCard />
      <OrderSummary />
      <SalesTeamPerformance />
      <OutletSummary />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.light,
  },
  icon: {
    marginHorizontal: 20,
  },
});

export default TeamPerformanceScreen;

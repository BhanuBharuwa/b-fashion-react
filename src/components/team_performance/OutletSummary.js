import {View, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {colors} from '../../constants/theme';
import {Subheading, Text} from 'react-native-paper';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const width = 0.4 * Dimensions.get('window').width;

const OutletSummary = () => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Subheading numberOfLines={1} style={styles.title}>
          Sales Manager Orders
        </Subheading>
        <Text style={styles.topText}>MTD</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.section}>
          <View style={[styles.textRow, {marginTop: 0}]}>
            <Text style={styles.text}>UTC</Text>
            <Text style={styles.text}>41</Text>
          </View>
          <View
            style={[
              styles.line,
              {backgroundColor: colors.primary, width: 0.4 * width},
            ]}
          />
          <View style={styles.textRow}>
            <Text style={styles.text}>UPC</Text>
            <Text style={styles.text}>4</Text>
          </View>
          <View
            style={[
              styles.line,
              {backgroundColor: colors.success, width: 0.3 * width},
            ]}
          />
          <View style={styles.textRow}>
            <Text style={styles.text}>Zero Orders</Text>
            <Text style={styles.text}>2</Text>
          </View>
          <View
            style={[
              styles.line,
              {backgroundColor: colors.accentPrimary, width: 0.3 * width},
            ]}
          />
          <View style={styles.textRow}>
            <Text style={styles.text}>Not visited</Text>
            <Text style={styles.text}>200</Text>
          </View>
          <View
            style={[
              styles.line,
              {backgroundColor: colors.error, width: 0.9 * width},
            ]}
          />
          <View style={styles.textRow}>
            <Text style={styles.text}>Total</Text>
            <Text style={styles.text}>300</Text>
          </View>
          <View
            style={[styles.line, {backgroundColor: colors.secondary, width}]}
          />
        </View>
        <View style={[styles.section, {borderLeftWidth: 0.2}]}>
          <Text style={styles.subtitle}>Productivity</Text>
          <View style={styles.row}>
            <View style={styles.subSection}>
              <Text>
                PC: <Text style={styles.amount}>100</Text>
              </Text>
              <Text>
                TC: <Text style={styles.amount}>200</Text>
              </Text>
            </View>
            <View style={styles.subSection}>
              <AnimatedCircularProgress
                size={60}
                width={1}
                fill={23}
                tintColor={colors.success}
                duration={0}
                backgroundColor="#DAE0E5"
                rotation={0}>
                {fill => <Text>{fill}%</Text>}
              </AnimatedCircularProgress>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.subSection}>
              <AnimatedCircularProgress
                size={60}
                width={1}
                fill={50}
                tintColor={'purple'}
                duration={0}
                backgroundColor="#DAE0E5"
                rotation={0}>
                {fill => <Text>{fill}%</Text>}
              </AnimatedCircularProgress>
              <Text style={styles.subText}>Covered</Text>
            </View>
            <View style={styles.subSection}>
              <AnimatedCircularProgress
                size={60}
                width={1}
                fill={0}
                tintColor={colors.success}
                duration={0}
                backgroundColor="#DAE0E5"
                rotation={0}>
                {fill => <Text>{fill}%</Text>}
              </AnimatedCircularProgress>
              <Text style={styles.subText}>Ordered</Text>
            </View>
          </View>
        </View>
      </View>
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
  row: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  section: {
    flex: 1,
    padding: 10,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 5,
  },
  line: {
    height: 2,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 1.2,
  },
  subRow: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontWeight: 'bold',
  },
  subSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  subText: {
    fontSize: 12,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
  },
});

export default OutletSummary;

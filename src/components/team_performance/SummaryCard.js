import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Subheading, Text} from 'react-native-paper';
import {colors} from '../../constants/theme';

const width = 0.4 * Dimensions.get('window').width;

const SummaryCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Subheading numberOfLines={1} style={styles.title}>
          User summary
        </Subheading>
        <View style={styles.textRow}>
          <Text style={styles.text}>Retailing</Text>
          <Text style={styles.text}>41</Text>
        </View>
        <View
          style={[
            styles.line,
            {backgroundColor: colors.primary, width: 0.4 * width},
          ]}
        />
        <View style={styles.textRow}>
          <Text style={styles.text}>Official work</Text>
          <Text style={styles.text}>4</Text>
        </View>
        <View
          style={[
            styles.line,
            {backgroundColor: colors.success, width: 0.3 * width},
          ]}
        />
        <View style={styles.textRow}>
          <Text style={styles.text}>Absent</Text>
          <Text style={styles.text}>2</Text>
        </View>
        <View
          style={[
            styles.line,
            {backgroundColor: colors.accentPrimary, width: 0.3 * width},
          ]}
        />
        <View style={styles.textRow}>
          <Text style={styles.text}>Total</Text>
          <Text style={styles.text}>100</Text>
        </View>
        <View
          style={[styles.line, {backgroundColor: colors.secondary, width}]}
        />
      </View>
      <View style={styles.card}>
        <Subheading numberOfLines={1} style={styles.title}>
          Calls summary
        </Subheading>
        <View style={styles.subRow}>
          <View style={styles.section}>
            <AnimatedCircularProgress
              size={60}
              width={1}
              fill={23}
              tintColor={colors.primary}
              duration={0}
              backgroundColor="#DAE0E5"
              rotation={0}>
              {fill => <Text>{fill}%</Text>}
            </AnimatedCircularProgress>
            <Text style={styles.subText}>Productivity</Text>
          </View>
          <View style={styles.section}>
            <AnimatedCircularProgress
              size={60}
              width={1}
              fill={10}
              tintColor={colors.success}
              duration={0}
              backgroundColor="#DAE0E5"
              rotation={0}>
              {fill => <Text>{fill}%</Text>}
            </AnimatedCircularProgress>
            <Text style={styles.subText}>Covered</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.left}>
            <Subheading>89</Subheading>
            <Text style={styles.subText}>PC</Text>
          </View>
          <View style={styles.right}>
            <View>
              <Subheading>89</Subheading>
              <Text style={styles.subText}>TC</Text>
            </View>
            <View>
              <Subheading>89</Subheading>
              <Text style={styles.subText}>SC</Text>
            </View>
          </View>
        </View>
        <Text style={styles.footerText}>Quantity: 100</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    padding: 10,
    elevation: 3,
    backgroundColor: colors.light,
    width: '49%',
    borderRadius: 5,
  },
  line: {
    height: 2,
  },
  title: {
    marginVertical: 5,
    fontSize: 14,
  },
  text: {
    fontSize: 12,
  },
  subRow: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subText: {
    fontSize: 12,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    borderLeftWidth: 1,
  },
  footerText: {
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 10,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 5,
  },
});

export default SummaryCard;

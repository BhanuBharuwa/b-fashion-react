import {View, StyleSheet, Dimensions, Pressable} from 'react-native';
import React from 'react';
import {colors} from '../../constants/theme';
import {Caption, Subheading, Text} from 'react-native-paper';
import PieChart from 'react-native-pie-chart';
import Icon from 'react-native-vector-icons/AntDesign';

const width = 0.4 * Dimensions.get('window').width;

const series = [123, 321, 123];
const sliceColor = ['#fbd203', '#ffb300', '#ff9100'];

const OrderSummary = () => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Subheading numberOfLines={1} style={styles.title}>
          Orders Summary
        </Subheading>
        <Text style={styles.topText}>MTD</Text>
      </View>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <View style={styles.qtyView}>
            <Text style={styles.qtyTitle}>Total</Text>
            <Text>10000000</Text>
          </View>
          <PieChart
            widthAndHeight={width}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.75}
            coverFill={'#FFF'}
          />
        </View>
        <View style={styles.right}>
          <View style={styles.item}>
            <View
              style={{
                width: 15,
                height: 15,
                borderRadius: 15,
                backgroundColor: '#ffb300',
              }}
            />
            <View style={{paddingHorizontal: 10}}>
              <Text numberOfLines={1} style={styles.text}>
                Slippers
              </Text>
              <Caption style={{paddingHorizontal: 5}}>
                10000 units (90%)
              </Caption>
            </View>
          </View>
          <View style={styles.item}>
            <View
              style={{
                width: 15,
                height: 15,
                borderRadius: 15,
                backgroundColor: '#fbd203',
              }}
            />
            <View style={{paddingHorizontal: 10}}>
              <Text numberOfLines={1} style={styles.text}>
                Sandals
              </Text>
              <Caption style={{paddingHorizontal: 5}}>1000 units (10%)</Caption>
            </View>
          </View>
          <View style={styles.item}>
            <View
              style={{
                width: 15,
                height: 15,
                borderRadius: 15,
                backgroundColor: '#ff9100',
              }}
            />
            <View style={{paddingHorizontal: 10}}>
              <Text numberOfLines={1} style={styles.text}>
                Others
              </Text>
              <Caption style={{paddingHorizontal: 5}}>5000 units (50%)</Caption>
            </View>
          </View>
        </View>
      </View>
      <Pressable style={styles.footer}>
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
  qtyView: {
    position: 'absolute',
    left: '30%',
    top: '33%',
    zIndex: 999999,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  qtyTitle: {
    fontWeight: 'bold',
  },
  right: {
    padding: 10,
    flex: 1,
  },
  text: {
    paddingHorizontal: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  footer: {
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OrderSummary;

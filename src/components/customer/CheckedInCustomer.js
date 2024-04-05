import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from '../../constants/theme';
import {Divider, Text} from 'react-native-paper';

const CheckedInCustomer = search => (
  <>
    {checkInCustomer.status && !search ? (
      <>
        <TouchableOpacity style={styles.container}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>{checkInCustomer.customer_name}</Text>
            <Text style={styles.subTitle}>
              {checkInCustomer.customer_address}
            </Text>
          </View>

          <Text style={styles.status}>Checked in</Text>
        </TouchableOpacity>
        <Divider />
      </>
    ) : null}
  </>
);

export default CheckedInCustomer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#CFDBC5',
    marginVertical: 10,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'green',
  },
  subTitle: {
    color: colors.dark,
  },

  status: {
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'green',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

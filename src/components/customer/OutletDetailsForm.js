import React, {memo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {HelperText, RadioButton, Text, TextInput} from 'react-native-paper';

const OutletDetailsForm = ({values, errors, handleChange, setFieldValue}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <TextInput
        value={values.whatsapp_number}
        style={styles.input}
        label="Whatsapp number"
        onChangeText={handleChange('whatsapp_number')}
        keyboardType="number-pad"
      />
      {errors.whatsapp_number && (
        <HelperText type="error">{errors.whatsapp_number}</HelperText>
      )}
      <Text>Competition Presence</Text>
      <View style={styles.row}>
        <RadioButton
          status={values.competition_presence ? 'checked' : 'unchecked'}
          onPress={() => setFieldValue('competition_presence', true)}
        />
        <Text>Yes</Text>
      </View>
      <View
        style={styles.row}
        onPress={() => setFieldValue('competition_presence', false)}>
        <RadioButton
          status={!values.competition_presence ? 'checked' : 'unchecked'}
          onPress={() => setFieldValue('competition_presence', false)}
        />
        <Text>No</Text>
      </View>
      {errors.competition_presence && (
        <HelperText type="error">{errors.competition_presence}</HelperText>
      )}
      <Text>Buying stock from</Text>
      <View style={styles.row}>
        <RadioButton
          status={
            values.buying_stock_from === 'authorized distributor'
              ? 'checked'
              : 'unchecked'
          }
          onPress={() =>
            setFieldValue('buying_stock_from', 'authorized distributor')
          }
        />
        <Text>Authorized distributor</Text>
      </View>
      <View style={styles.row}>
        <RadioButton
          status={
            values.buying_stock_from === 'other' ? 'checked' : 'unchecked'
          }
          onPress={() => setFieldValue('buying_stock_from', 'other')}
        />
        <Text>Other</Text>
      </View>
      {errors.buying_stock_from && (
        <HelperText type="error">{errors.buying_stock_from}</HelperText>
      )}
      <TextInput
        value={values.length}
        style={styles.input}
        label="Size of the outlet sq feet (Length)"
        onChangeText={handleChange('length')}
        keyboardType="number-pad"
      />
      {errors.length && <HelperText type="error">{errors.length}</HelperText>}
      <TextInput
        value={values.width}
        style={styles.input}
        label="Size of the outlet sq feet (Width)"
        onChangeText={handleChange('width')}
        keyboardType="number-pad"
      />
      {errors.width && <HelperText type="error">{errors.width}</HelperText>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 10,
    backgroundColor: 'transparent',
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

export default memo(OutletDetailsForm);

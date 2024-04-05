import React, {memo} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {HelperText, TextInput} from 'react-native-paper';

const NumberRegistration = ({values, handleChange, errors}) => {
  return (
    <ScrollView>
      <TextInput
        value={values.contact_number}
        onChangeText={handleChange('contact_number')}
        label="Contact number"
        style={styles.input}
        keyboardType="number-pad"
      />
      {errors.contact_number && (
        <HelperText type="error">{errors.contact_number}</HelperText>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
});

export default memo(NumberRegistration);

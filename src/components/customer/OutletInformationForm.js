import {Picker} from '@react-native-picker/picker';
import React, {memo, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {HelperText} from 'react-native-paper';
import {colors} from '../../constants/theme';
import useAddCustomer from '../../screens/customer/hooks/useAddCustomer';

const OutletInformationForm = ({
  values,
  errors,
  setFieldValue,
  customerCategories,
  customerChannels,
  customerClasses,
}) => {
  const {formik} = useAddCustomer();

  useEffect(() => {
    formik.validateForm();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.picker}>
        <Picker
          selectedValue={values.customer_category_id}
          onValueChange={val => setFieldValue('customer_category_id', val)}>
          <Picker.Item label="Select customer category" value="" />
          {customerCategories.map(item => (
            <Picker.Item value={item._id} label={item.name} key={item._id} />
          ))}
        </Picker>
      </View>
      {errors.customer_category_id && (
        <HelperText type="error">{errors.customer_category_id}</HelperText>
      )}
      <View style={styles.picker}>
        <Picker
          selectedValue={values.customer_class_id}
          onValueChange={val => setFieldValue('customer_class_id', val)}>
          <Picker.Item label="Select customer class" value="" />
          {customerClasses.map(item => (
            <Picker.Item value={item._id} label={item.name} key={item._id} />
          ))}
        </Picker>
      </View>
      {errors.customer_class_id && (
        <HelperText type="error">{errors.customer_class_id}</HelperText>
      )}
      <View style={styles.picker}>
        <Picker
          selectedValue={values.customer_channel_id}
          onValueChange={val => setFieldValue('customer_channel_id', val)}>
          <Picker.Item label="Select customer channel" value="" />
          {customerChannels.map(item => (
            <Picker.Item value={item._id} label={item.name} key={item._id} />
          ))}
        </Picker>
      </View>
      {errors.customer_channel_id && (
        <HelperText type="error">{errors.customer_channel_id}</HelperText>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
  },
  picker: {
    marginVertical: 10,
    elevation: 3,
    backgroundColor: colors.light,
    borderRadius: 10,
  },
});

export default memo(OutletInformationForm);

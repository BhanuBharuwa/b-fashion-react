import {Picker} from '@react-native-picker/picker';
import React, {memo, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {HelperText, Subheading, TextInput} from 'react-native-paper';
import {colors} from '../../constants/theme';
import useSchedule from '../../screens/my_schedule/hooks/useSchedule';

const GeneralInformationForm = ({
  values,
  setFieldValue,
  handleChange,
  errors,
}) => {
  const {areas, fetchAreas} = useSchedule();

  useEffect(() => {
    fetchAreas();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <Subheading style={styles.title}>Shop Information</Subheading>
      <View style={styles.picker}>
        <Picker
          selectedValue={values.area_id}
          onValueChange={val => setFieldValue('area_id', val)}>
          <Picker.Item label="Select area" value="" />
          {areas.map(item => (
            <Picker.Item value={item._id} label={item.name} key={item._id} />
          ))}
        </Picker>
      </View>
      {errors.area_id && <HelperText type="error">{errors.area_id}</HelperText>}
      <TextInput
        value={values.name}
        style={styles.input}
        label="Name"
        onChangeText={handleChange('name')}
      />
      {errors.name && <HelperText type="error">{errors.name}</HelperText>}

      <TextInput
        value={values.market_name}
        style={styles.input}
        label="Market name"
        onChangeText={handleChange('market_name')}
      />
      {errors.market_name && (
        <HelperText type="error">{errors.market_name}</HelperText>
      )}

      <TextInput
        value={values.pin_code}
        style={styles.input}
        label="Pin code"
        onChangeText={handleChange('pin_code')}
      />
      {errors.pin_code && (
        <HelperText type="error">{errors.pin_code}</HelperText>
      )}

      <Subheading style={styles.title}>Contact Information</Subheading>
      <TextInput
        value={values.owner_name}
        style={styles.input}
        label="Owner name"
        onChangeText={handleChange('owner_name')}
      />
      {errors.owner_name && (
        <HelperText type="error">{errors.owner_name}</HelperText>
      )}

      <TextInput
        value={values.email}
        style={styles.input}
        label="Email"
        onChangeText={handleChange('email')}
      />
      {errors.email && <HelperText type="error">{errors.email}</HelperText>}
      <Subheading style={styles.title}>Tax Information</Subheading>
      <View style={styles.picker}>
        <Picker
          selectedValue={values.gst_type}
          onValueChange={val => setFieldValue('gst_type', val)}>
          <Picker.Item label="Select GST type" value="" />
          <Picker.Item label="Regular" value="regular" />
          <Picker.Item label="Composite" value="composite" />
          <Picker.Item label="Unregistered" value="unregistered" />
        </Picker>
      </View>
      {errors.gst_type && (
        <HelperText type="error">{errors.gst_type}</HelperText>
      )}
      <TextInput
        value={values.gst_number}
        style={styles.input}
        label="GST number"
        onChangeText={handleChange('gst_number')}
      />
      {errors.gst_number && (
        <HelperText type="error">{errors.gst_number}</HelperText>
      )}
      <TextInput
        value={values.aadhar_card_number}
        style={styles.input}
        label="Aadhar card number"
        onChangeText={handleChange('aadhar_card_number')}
      />
      {errors.aadhar_card_number && (
        <HelperText type="error">{errors.aadhar_card_number}</HelperText>
      )}
      <TextInput
        value={values.pan}
        style={styles.input}
        label="PAN"
        onChangeText={handleChange('pan')}
      />
      {errors.pan && <HelperText type="error">{errors.pan}</HelperText>}
      <Subheading style={styles.title}>Bank Details Information</Subheading>
      <TextInput
        value={values.account_owner_name}
        style={styles.input}
        label="Account owner name"
        onChangeText={handleChange('account_owner_name')}
      />
      {errors.account_owner_name && (
        <HelperText type="error">{errors.account_owner_name}</HelperText>
      )}
      <TextInput
        value={values.account_number}
        style={styles.input}
        label="Account number"
        onChangeText={handleChange('account_number')}
      />
      {errors.account_number && (
        <HelperText type="error">{errors.account_number}</HelperText>
      )}
      <TextInput
        value={values.ifsc_code}
        style={styles.input}
        label="IFSC Code"
        onChangeText={handleChange('ifsc_code')}
      />
      {errors.ifsc_code && (
        <HelperText type="error">{errors.ifsc_code}</HelperText>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
  },
  input: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  picker: {
    marginVertical: 10,
    elevation: 3,
    backgroundColor: colors.light,
    borderRadius: 10,
  },
  title: {
    letterSpacing: 1.1,
    color: colors.primary,
  },
});

export default memo(GeneralInformationForm);

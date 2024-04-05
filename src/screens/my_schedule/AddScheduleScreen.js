import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../constants/theme';
import {Button, HelperText, TextInput} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import useSchedule from './hooks/useSchedule';
import moment from 'moment';
import {useEffect} from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';

const AddScheduleScreen = () => {
  const {areas, loading, errors, submitAreaSchedule, fetchAreas} =
    useSchedule();

  const [selectedArea, setSelectedArea] = useState('');
  const [date, setDate] = useState(new Date());
  const [remarks, setRemarks] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.picker, styles.input]}>
        <Picker
          selectedValue={selectedArea}
          onValueChange={val => setSelectedArea(val)}>
          <Picker.Item label="Select area" value="" />
          {areas.map(item => (
            <Picker.Item key={item._id} label={item.name} value={item._id} />
          ))}
        </Picker>
      </View>
      {errors?.area_id && (
        <HelperText type="error">{errors?.area_id}</HelperText>
      )}
      {/* <View style={[styles.picker, styles.input]}>
        <Picker>
          <Picker.Item label="Select schedule type" value="" />
        </Picker>
      </View> */}
      <Pressable onPress={() => setVisible(true)}>
        <TextInput
          label="Select date"
          style={styles.input}
          value={moment(date).format('DD MMMM YYYY')}
          editable={false}
        />
      </Pressable>
      {errors?.date && <HelperText type="error">{errors?.date}</HelperText>}

      <DateTimePicker
        date={date}
        minimumDate={new Date()}
        isVisible={visible}
        onCancel={() => setVisible(false)}
        onConfirm={date => {
          setVisible(false);
          setDate(date);
        }}
      />
      <TextInput
        label="Enter remarks"
        style={styles.input}
        value={remarks}
        onChangeText={setRemarks}
      />
      <Button
        mode="contained"
        style={styles.btn}
        loading={loading}
        disabled={loading}
        onPress={() => {
          submitAreaSchedule(
            selectedArea,
            moment(date).format('YYYY-MM-DD'),
            remarks,
          );
        }}>
        Submit
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.light,
  },
  input: {
    marginVertical: 10,
    backgroundColor: colors.light,
  },
  picker: {
    elevation: 3,
    borderRadius: 10,
    marginHorizontal: 2,
  },
  btn: {
    marginVertical: 10,
  },
});

export default AddScheduleScreen;

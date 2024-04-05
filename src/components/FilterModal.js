import {View, Text, StyleSheet, Pressable} from 'react-native';
import React, {useState} from 'react';
import {Button, Dialog, Portal, TextInput} from 'react-native-paper';
import {colors} from '../constants/theme';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';

const FilterModal = ({
  visible,
  startDate,
  endDate,
  onStartDateChange,
  onEndDatechange,
  onOkClick,
}) => {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  return (
    <Portal>
      <Dialog visible={visible} style={styles.dialog} dismissable={false}>
        <Dialog.Title>Filter</Dialog.Title>
        <Dialog.Content>
          <Pressable onPress={() => setStartDateOpen(true)}>
            <TextInput
              value={moment(startDate).format('DD MMMM YYYY')}
              editable={false}
              label="Start date"
              style={styles.input}
            />
          </Pressable>
          <Pressable onPress={() => setEndDateOpen(true)}>
            <TextInput
              value={moment(endDate).format('DD MMMM YYYY')}
              editable={false}
              label="End date"
              style={styles.input}
            />
          </Pressable>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onOkClick}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
      <DateTimePicker
        isVisible={startDateOpen}
        mode="date"
        date={startDate}
        onCancel={() => setStartDateOpen(false)}
        onConfirm={date => {
          setStartDateOpen(false);
          onStartDateChange(date);
        }}
      />
      <DateTimePicker
        isVisible={endDateOpen}
        mode="date"
        date={endDate}
        onCancel={() => setEndDateOpen(false)}
        onConfirm={date => {
          setEndDateOpen(false);
          onEndDatechange(date);
        }}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: colors.light,
  },
  input: {
    marginVertical: 5,
    backgroundColor: colors.light,
  },
});

export default FilterModal;

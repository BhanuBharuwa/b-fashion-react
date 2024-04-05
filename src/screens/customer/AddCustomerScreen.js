import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {colors} from '../../constants/theme';
import useAddCustomer from './hooks/useAddCustomer';

const AddCustomerScreen = ({navigation}) => {
  const {
    formik,
    activeIndex,
    ref,
    steps,
    onPreviousPress,
    fetchCustomerChannels,
    fetchCustomerTypes,
    fetchCustomerClasses,
  } = useAddCustomer();

  useEffect(() => {
    fetchCustomerChannels();
    fetchCustomerTypes();
    fetchCustomerClasses();
  }, []);

  const {handleSubmit, isSubmitting} = formik;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FlatList
          data={steps}
          ref={ref}
          keyExtractor={item => item.index}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <View style={styles.item}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor:
                      activeIndex === index ? colors.primary : colors.lightGrey,
                  },
                ]}>
                <Text style={styles.itemText}>{item.index + 1}</Text>
              </View>
              <Text
                style={
                  activeIndex === index ? styles.textHighlight : styles.text
                }>
                {item.name}
              </Text>
            </View>
          )}
        />
      </View>
      <View style={styles.body}>
        {steps.map(
          (item, index) =>
            index === activeIndex && {...item.element, key: item.index},
        )}
      </View>
      <View style={styles.footer}>
        <Button
          mode="contained"
          disabled={activeIndex === 0}
          style={styles.button}
          theme={{roundness: 1}}
          onPress={onPreviousPress}>
          Prev
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          theme={{roundness: 1}}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}>
          {activeIndex === steps.length - 1 ? 'Add' : 'Next'}
        </Button>
      </View>
    </View>
  );
};

export default AddCustomerScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.light,
    flex: 1,
  },
  footer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: '40%',
  },
  header: {
    flex: 1,
  },
  body: {
    flex: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  circle: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    color: colors.light,
  },
  text: {
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  textHighlight: {
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

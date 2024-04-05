import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {colors} from '../../constants/theme';
import {useEffect} from 'react';

const DurationView = ({punchInTime, punchOutTime}) => {
  const [duration, setDuration] = React.useState('-- : -- : --');

  useEffect(() => {
    calculateDuration();
  }, []);

  const calculateDuration = async () => {
    if (punchInTime) {
      const {hours, minutes} = splitTime(punchInTime);
      const inTime = new Date();
      inTime.setHours(hours, minutes);

      let outTime = new Date();
      if (punchOutTime) {
        const {hours, minutes} = splitTime(punchOutTime);
        outTime.setHours(hours, minutes);
      } else {
        outTime = new Date();
      }

      const diff = outTime.getTime() - inTime.getTime();

      const {hour, minute, second} = convertMilliseconds(diff);

      convertDurationToString(hour, minute, second);
    }
  };

  const splitTime = time => {
    const timeArray = time.split(':');
    const hours = timeArray[0];
    const minutes = timeArray[1];
    return {hours, minutes};
  };

  const convertMilliseconds = milliseconds => {
    const second = Math.floor((milliseconds / 1000) % 60);
    const minute = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hour = Math.floor(milliseconds / (1000 * 60 * 60));

    return {hour, minute, second};
  };

  const convertDurationToString = (hour, minute, second) => {
    let duration = '';
    if (hour < 10) {
      duration = duration.concat(...duration, `0${hour}`);
    } else {
      duration = duration.concat(...duration, `${hour}`);
    }

    if (minute < 10) {
      duration = duration.concat(' : ', `0${minute}`);
    } else {
      duration = duration.concat(' : ', `${minute}`);
    }

    if (second < 10) {
      duration = duration.concat(' : ', `0${second}`);
    } else {
      duration = duration.concat(' : ', `${second}`);
    }

    console.log(`${hour} ${minute} ${second} ${duration}`);

    setDuration(duration);
  };

  return (
    <>
      <Text variant="bodyLarge" style={{alignSelf: 'center', marginTop: 20}}>
        Duration
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          marginBottom: 10,
        }}>
        <Text variant="displaySmall" style={{color: colors.primary}}>
          {duration}
        </Text>
      </View>
    </>
  );
};

export default DurationView;

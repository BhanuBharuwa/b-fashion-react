import {useEffect} from 'react';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Greeting = () => {
  const [greeting, setGreeting] = useState('GOOD MORNING');
  const [color, setColor] = useState('#ff8100');
  const [icon, setIcon] = useState('weather-sunny');

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
    } else if (currentHour >= 12 && currentHour < 16) {
      setIcon('white-balance-sunny');
      setColor('#ffa700'); 
      setGreeting('GOOD AFTERNOON');
    } else if (currentHour >= 16 && currentHour < 20) {
      setIcon('weather-sunset');
      setColor('#dc6d20'); 
      setGreeting('GOOD EVENING');
    } else {
      setIcon('weather-night');
      setColor('#002b36');
      setGreeting('GOOD NIGHT');
    }
  }, []);

  return (
    <Card
      style={[
        styles.card,
        {
          padding: 0,
          marginTop: 20,
        },
      ]}>
      <View style={styles.greetingContainer}>
        <Text
          style={{
            fontWeight: '600',
            fontSize: 18,
          }}>
          {greeting}
        </Text>
        <Icon name={icon} size={40} color={color} />
      </View>
    </Card>
  );
};

export default Greeting;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    padding: 10,
    elevation: 2,
    shadowOpacity: 0.7,
    shadowOffset: {width: -4, height: -4},
    shadowRadius: 10,
    marginHorizontal: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
  },

  greetingContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

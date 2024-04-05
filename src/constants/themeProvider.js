import {DefaultTheme} from 'react-native-paper';
import {colors} from './theme';

export const themes = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
};

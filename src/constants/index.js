import {Dimensions} from 'react-native';
import {Colors} from '../styles/Colors';
import {v4 as uuidv4} from 'uuid';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

export const MENU = [
  {
    id: uuidv4(),
    name: `café au lait`,
    duration: 4,
  },
  {
    id: uuidv4(),
    name: 'cappuccino',
    duration: 10,
  },
  {
    id: uuidv4(),
    name: 'espresso',
    duration: 15,
  },
];

export const SHORT_TOAST = {
  duration: 1000,
  position: WINDOW_HEIGHT * 0.055,
  borderRadius: 6,
  backgroundColor: Colors.secondaryDark,
  shadow: true,
  animation: true,
  hideOnPress: true,
  delay: 0,
  opacity: 1,
};

export const LONG_TOAST = {
  duration: 2000,
  position: WINDOW_HEIGHT * 0.055,
  borderRadius: 6,
  backgroundColor: Colors.secondaryDark,
  shadow: true,
  animation: true,
  hideOnPress: true,
  delay: 0,
  opacity: 1,
};

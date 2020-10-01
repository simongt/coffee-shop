import { Dimensions } from 'react-native';
import { Colors } from '../styles';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

export const ANIMATION_SPEED = 4; // cuz aint nobody got time

export const MENU = [
  {
    id: 'coffee-001',
    name: `café au lait`,
    duration: 4
  },
  {
    id: 'coffee-002',
    name: 'cappuccino',
    duration: 10
  },
  {
    id: 'coffee-003',
    name: 'espresso',
    duration: 15
  }
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
  opacity: 1
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
  opacity: 1
};

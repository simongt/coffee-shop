import {Dimensions} from 'react-native';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

export const MENU = [
  {
    id: 1,
    name: `café au lait`,
    duration: 4,
  },
  {
    id: 2,
    name: 'cappuccino',
    duration: 10,
  },
  {
    id: 3,
    name: 'espresso',
    duration: 15,
  },
];

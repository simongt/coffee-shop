import {Dimensions} from 'react-native';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

export const MENU = [
  {
    id: 1,
    name: `Café au lait`,
    duration: 4,
  },
  {
    id: 2,
    name: 'Cappuccino',
    duration: 10,
  },
  {
    id: 3,
    name: 'Espresso',
    duration: 15,
  },
];

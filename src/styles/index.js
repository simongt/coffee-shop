import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const colorPalette = {
  champagnePink: '#FDE8D8',
  peachPuff: '#FAD1B0',
  orangeYellow: '#E9C46A',
  sunray: '#EFB366',
  sandyBrown: '#F4A261', // info
  newYorkPink: '#CF7B6C',
  copperPenny: '#B86E6B',
  roseDust: '#A1606A',
  tuscanRed: '#7E5358',
  mauveTaupe: '#81505B',
  puce: '#CF8DA7',
  chinaRose: '#AA5377',
  twilightLavender: '#734568', // primary light
  spaceCadet: '#3B3759', // primary
  eggplant: '#503644',
  englishViolet: '#49314b',
  raisinBlack: '#1E1C2D', // primary dark
  gunmetal: '#222A37',
  blueSapphire: '#31627D',
  darkElectricBlue: '#4C6E81', // secondary dark
  steelTeal: '#638D9A', // secondary
  cadetBlue: '#7AACB3' // secondary light
};

// functional aliases for color palette
export const Colors = {
  primary: colorPalette.spaceCadet,
  primaryLight: colorPalette.twilightLavender,
  primaryDark: colorPalette.raisinBlack,
  secondary: colorPalette.steelTeal,
  secondaryLight: colorPalette.cadetBlue,
  secondaryDark: colorPalette.darkElectricBlue,
  info: colorPalette.twilightLavender,
  warning: colorPalette.twilightLavender,
  error: colorPalette.twilightLavender,
  success: colorPalette.twilightLavender,
  ...colorPalette
};

export const Theme = {
  ...DarkTheme,
  barStyle: 'light-content',
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primaryDark,
    background: Colors.primaryDark,
    card: Colors.primaryDark,
    text: Colors.peachPuff,
    border: Colors.primaryDark,
    notification: Colors.info
  }
};

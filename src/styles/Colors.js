const colorPalette = {
  peachPuff: '#FAD1B0',
  orangeYellow: '#E9C46A',
  sunray: '#EFB366',
  sandyBrown: '#F4A261', // info
  newYorkPink: '#CF7B6C',
  tuscanRed: '#7E5358',
  puce: '#CF8DA7',
  chinaRose: '#AA5377',
  twilightLavender: '#734568', // primary light
  spaceCadet: '#3B3759', // primary
  raisinBlack: '#1E1C2D', // primary dark
  gunmetal: '#222A37',
  darkElectricBlue: '#4C6E81', // secondary dark
  steelTeal: '#638D9A', // secondary
  cadetBlue: '#7AACB3', // secondary light
};

// functional aliases for color palette
export const Colors = {
  primary: colorPalette.spaceCadet,
  primaryLight: colorPalette.twilightLavender,
  primaryDark: colorPalette.raisinBlack,
  secondary: colorPalette.steelTeal,
  secondaryLight: colorPalette.cadetBlue,
  secondaryDark: colorPalette.darkElectricBlue,
  info: 'blue',
  warning: 'yellow',
  error: 'red',
  success: 'green',
  lightGrey: 'lightgrey',
  grey: 'grey',
  darkGrey: 'darkgrey',
  ...colorPalette,
};

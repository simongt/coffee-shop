import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppearanceProvider, useColorScheme} from 'react-native-appearance';
import MainTabs from './MainTabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {Colors} from '../styles/Colors';

const Stack = createStackNavigator();

const AppNavigator = (props) => {
  const scheme = useColorScheme();

  return (
    <AppearanceProvider>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{
              title: 'the coffee shop',
              headerStyle: {
                backgroundColor: Colors.primaryDark,
                shadowColor: 'transparent',
              },
              headerTintColor: Colors.tuscanRed,
              headerTitleStyle: {
                fontWeight: '100',
                fontSize: 32,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
};

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primaryDark,
    background: Colors.primaryDark,
    card: Colors.primaryDark,
    text: Colors.peachPuff,
    border: Colors.primaryDark,
    notification: Colors.info,
  },
};

export default AppNavigator;

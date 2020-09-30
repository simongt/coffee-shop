import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabs from './MainTabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme
} from '@react-navigation/native';
import { Colors } from '../styles';

type Props = {
  children?: React.Node
};

const Stack = createStackNavigator();

export const StackNavigator = (props: Props): React$Node => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Main'
        component={MainTabs}
        options={{
          title: 'the coffee shop',
          headerStyle: {
            backgroundColor: Colors.primaryDark,
            shadowColor: 'transparent'
          },
          headerTintColor: Colors.tuscanRed,
          headerTitleStyle: {
            fontWeight: '100',
            fontSize: 32
          }
        }}
      />
    </Stack.Navigator>
  );
};

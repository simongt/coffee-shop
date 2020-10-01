import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabs from './MainTabs';
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
        children={() => <MainTabs {...props} />}
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

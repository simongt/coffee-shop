import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabs from './MainTabs';
import { Colors } from '../styles';

type Props = {
  children?: React.Node
};

const Stack = createStackNavigator();

/**
 * Root stack navigator for the coffee shop application.
 * 
 * This component sets up the main navigation structure with a single stack
 * that contains the MainTabs navigator. The header is styled to match
 * the coffee shop theme with custom colors and typography.
 * 
 * @param {Props} props - Component props (currently unused)
 * @returns {React$Node} The configured stack navigator
 */
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

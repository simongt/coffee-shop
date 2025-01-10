import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Menu, Queue, Pickup } from '../screens';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../styles';
import { OrdersContext } from '../hooks';

const Tab = createMaterialBottomTabNavigator();

/**
 * Main tab navigator that provides the core navigation between the three
 * primary screens of the coffee shop application.
 * 
 * This component uses Material Bottom Tabs and integrates with the OrdersContext
 * to display real-time badge counts for the queue and pickup tabs.
 * 
 * Tab Structure:
 * - Order: Menu screen for placing new orders
 * - Queue: Shows orders currently being prepared with progress tracking
 * - Pickup: Displays completed orders ready for customer pickup
 * 
 * @param {Props} props - Component props passed to child screens
 * @returns {React$Node} The configured tab navigator
 */
const MainTabs = (props: Props): React$Node => {
  const Orders = React.useContext(OrdersContext);
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: Colors.orangeYellow,
        inactiveTintColor: Colors.secondaryLight
      }}
      barStyle={{ paddingBottom: 10, backgroundColor: 'transparent' }}
    >
      <Tab.Screen
        name='Order'
        children={() => <Menu {...props} />}
        options={{
          tabBarLabel: 'order',
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome
              name={'coffee'}
              size={26}
              style={{ marginBottom: -5 }}
              color={focused ? Colors.puce : Colors.secondaryDark}
            />
          )
        }}
      />
      <Tab.Screen
        name='Queue'
        children={() => <Queue {...props} />}
        options={{
          tabBarLabel: 'queue',
          tabBarBadge:
            Orders.queue.length === 0 ? null : `${Orders.queue.length}`,
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome
              name={'hourglass-half'}
              size={26}
              style={{ marginBottom: -5 }}
              color={focused ? Colors.puce : Colors.secondaryDark}
            />
          )
        }}
      />
      <Tab.Screen
        name='Pickup'
        children={() => <Pickup {...props} />}
        options={{
          tabBarLabel: 'pickup',
          tabBarBadge:
            Orders.pickup.length === 0 ? null : `${Orders.pickup.length}`,
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome
              name={'check-square'}
              size={26}
              style={{ marginBottom: -5 }}
              color={focused ? Colors.puce : Colors.secondaryDark}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;

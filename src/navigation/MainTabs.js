import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Menu, Queue, Pickup } from '../screens';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../styles';
import { OrdersContext } from '../hooks';
const Tab = createBottomTabNavigator();

const MainTabs = props => {
  const Orders = React.useContext(OrdersContext);
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: Colors.orangeYellow,
        inactiveTintColor: Colors.secondaryLight
      }}
    >
      <Tab.Screen
        name='Order'
        children={() => <Menu />}
        options={{
          tabBarLabel: 'order',
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome
              name={'coffee'}
              size={26}
              style={{ marginBottom: -3 }}
              color={focused ? Colors.puce : Colors.secondaryDark}
            />
          )
        }}
      />
      <Tab.Screen
        name='Queue'
        children={() => <Queue />}
        options={{
          tabBarLabel: 'queue',
          tabBarBadge:
            Orders.ordersQueued.length === 0
              ? null
              : `${Orders.ordersQueued.length}`,
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome
              name={'hourglass-half'}
              size={26}
              style={{ marginBottom: -3 }}
              color={focused ? Colors.puce : Colors.secondaryDark}
            />
          )
        }}
      />
      <Tab.Screen
        name='Pickup'
        children={() => <Pickup />}
        options={{
          tabBarLabel: 'pickup',
          tabBarBadge:
            Orders.ordersPrepped.length === 0
              ? null
              : `${Orders.ordersPrepped.length}`,
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome
              name={'check-square'}
              size={26}
              style={{ marginBottom: -3 }}
              color={focused ? Colors.puce : Colors.secondaryDark}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;

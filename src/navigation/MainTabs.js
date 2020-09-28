import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MenuScreen from '../screens/MenuScreen';
import OrdersScreen from '../screens/OrdersScreen';
import CounterScreen from '../screens/CounterScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../styles';

const Tab = createBottomTabNavigator();

const MainTabs = (props) => {
  const [ordersQueued, setOrdersQueued] = React.useState([]);
  const [ordersPrepped, setOrdersPrepped] = React.useState([]);

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: Colors.tiffanyBlue,
        inactiveTintColor: Colors.davysGrey,
      }}>
      <Tab.Screen
        name="Order"
        component={MenuScreen}
        options={{
          tabBarLabel: 'Order',
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome
              name={'coffee'}
              size={26}
              style={{marginBottom: -3}}
              color={focused ? Colors.tiffanyBlue : Colors.davysGrey}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Queue"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Queue',
          tabBarBadge:
            ordersQueued.length === 0 ? null : `${ordersQueued.length}`,
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome
              name={'hourglass-half'}
              size={26}
              style={{marginBottom: -3}}
              color={focused ? Colors.tiffanyBlue : Colors.davysGrey}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Pickup"
        component={CounterScreen}
        options={{
          tabBarLabel: 'Pickup',
          tabBarBadge:
            ordersPrepped.length === 0 ? null : `${ordersPrepped.length}`,
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome
              name={'check-square'}
              size={26}
              style={{marginBottom: -3}}
              color={focused ? Colors.tiffanyBlue : Colors.davysGrey}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;

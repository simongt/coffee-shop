import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MenuScreen from '../screens/MenuScreen';
import OrdersScreen from '../screens/QueueScreen';
import CounterScreen from '../screens/PickupScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../styles/Colors';

const Tab = createBottomTabNavigator();

const MainTabs = (props) => {
  const [ordersQueued, setOrdersQueued] = React.useState([]);
  const [ordersPrepped, setOrdersPrepped] = React.useState([]);

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: Colors.orangeYellow,
        inactiveTintColor: Colors.secondaryLight,
      }}>
      <Tab.Screen
        name="Order"
        children={() => (
          <MenuScreen
            ordersQueued={ordersQueued}
            setOrdersQueued={setOrdersQueued}
            ordersPrepped={ordersPrepped}
            setOrdersPrepped={setOrdersPrepped}
          />
        )}
        options={{
          tabBarLabel: 'order',
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome
              name={'coffee'}
              size={26}
              style={{marginBottom: -3}}
              color={focused ? Colors.puce : Colors.secondaryDark}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Queue"
        children={() => (
          <OrdersScreen
            ordersQueued={ordersQueued}
            setOrdersQueued={setOrdersQueued}
            ordersPrepped={ordersPrepped}
            setOrdersPrepped={setOrdersPrepped}
          />
        )}
        options={{
          tabBarLabel: 'queue',
          tabBarBadge:
            ordersQueued.length === 0 ? null : `${ordersQueued.length}`,
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome
              name={'hourglass-half'}
              size={26}
              style={{marginBottom: -3}}
              color={focused ? Colors.puce : Colors.secondaryDark}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Pickup"
        children={() => (
          <CounterScreen
            ordersQueued={ordersQueued}
            setOrdersQueued={setOrdersQueued}
            ordersPrepped={ordersPrepped}
            setOrdersPrepped={setOrdersPrepped}
          />
        )}
        options={{
          tabBarLabel: 'pickup',
          tabBarBadge:
            ordersPrepped.length === 0 ? null : `${ordersPrepped.length}`,
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome
              name={'check-square'}
              size={26}
              style={{marginBottom: -3}}
              color={focused ? Colors.puce : Colors.secondaryDark}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;

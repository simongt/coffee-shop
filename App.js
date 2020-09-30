import * as React from 'react';
import { StatusBar } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './src/navigation';
import { Theme } from './src/styles';
import { OrdersContext } from './src/hooks';

const App: () => React$Node = () => {
  const scheme = useColorScheme();
  const [ordersQueued, setOrdersQueued] = React.useState([]);
  const [ordersPrepped, setOrdersPrepped] = React.useState([]);
  return (
    <AppearanceProvider>
      <StatusBar
        barStyle={Theme.barStyle}
        animated={true}
        translucent={true}
        hidden={true}
      />
      <OrdersContext.Provider
        value={{
          ordersQueued,
          setOrdersQueued,
          ordersPrepped,
          setOrdersPrepped
        }}
      >
        <NavigationContainer theme={Theme}>
          <StackNavigator />
        </NavigationContainer>
      </OrdersContext.Provider>
    </AppearanceProvider>
  );
};

export default App;

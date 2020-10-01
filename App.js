import * as React from 'react';
import { StatusBar } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './src/navigation';
import { Theme } from './src/styles';
import { OrdersContext } from './src/hooks';

const App: () => React$Node = () => {
  const scheme = useColorScheme();
  const [queue, setQueue] = React.useState([]);
  const [pickup, setPickup] = React.useState([]);
  return (
    <AppearanceProvider>
      <StatusBar barStyle={Theme.barStyle} translucent={true} animated={true} />
      <OrdersContext.Provider value={{ queue, setQueue, pickup, setPickup }}>
        <NavigationContainer theme={Theme}>
          <StackNavigator />
        </NavigationContainer>
      </OrdersContext.Provider>
    </AppearanceProvider>
  );
};

export default App;

import * as React from 'react';
import { StatusBar } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './src/navigation';
import { Theme } from './src/styles';
import { OrdersContext } from './src/hooks';

/**
 * Main App component that serves as the root of the coffee shop application.
 * 
 * This component sets up the core application structure including:
 * - Theme and appearance management
 * - Navigation container
 * - Global state management for orders via React Context
 * - Status bar configuration
 * 
 * The app uses a simple Context-based state management approach where:
 * - `queue`: Array of orders currently being prepared
 * - `pickup`: Array of completed orders ready for pickup
 * 
 * @returns {React$Node} The root application component
 */
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

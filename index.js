import { AppRegistry, LogBox, NativeModules } from 'react-native';
import 'react-native-get-random-values';
import App from './App';
import { name as appName } from './app.json';

LogBox.ignoreLogs([
  `Cannot update a component from inside the function body of a different component.`,
  `Can't perform a React state update on an unmounted component`
]);

// force enable Debug Remotely on debug mode (iOS only)
// if (__DEV__ && Platform.OS === 'ios') {
//   NativeModules.DevSettings.setIsDebuggingRemotely(true);
// }

AppRegistry.registerComponent(appName, () => App);

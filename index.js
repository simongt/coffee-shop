import { AppRegistry, LogBox, NativeModules } from 'react-native';
import 'react-native-get-random-values';
import App from './App';
import { name as appName } from './app.json';

LogBox.ignoreLogs([
  `Cannot update a component from inside the function body of a different component.`,
  `Can't perform a React state update on an unmounted component`,
  `Remote debugger is in a background tab which may cause apps to perform slowly`
]);

if (__DEV__ && Platform.OS === 'ios') {
  // force enable Debug Remotely on debug mode (iOS only)
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

AppRegistry.registerComponent(appName, () => App);

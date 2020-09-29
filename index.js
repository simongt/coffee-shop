import {AppRegistry, LogBox} from 'react-native';
import 'react-native-get-random-values';
import App from './App';
import {name as appName} from './app.json';

LogBox.ignoreLogs([
  'Cannot update a component from inside the function body of a different component.',
]);

AppRegistry.registerComponent(appName, () => App);

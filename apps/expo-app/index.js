import {  AppRegistry, LogBox } from 'react-native';
import { registerRootComponent } from 'expo';

import App from './App';
import { name as appName } from './app.json';


LogBox.ignoreAllLogs(true);

registerRootComponent(App);
AppRegistry.registerComponent(appName, () => App);

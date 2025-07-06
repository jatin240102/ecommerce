/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { AppProvider } from './src/context/AppContext';
import 'react-native-get-random-values';
import messaging from '@react-native-firebase/messaging';

// AppRegistry.registerComponent(appName, () => <AppProvider>App</AppProvider>);
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // You can add logic here to process the notification
});

AppRegistry.registerComponent(appName, () => () => (
  <AppProvider>
    <App />
  </AppProvider>
));

import 'node-libs-react-native/globals';
import { EventEmitter } from 'events';
import { Alert, AppRegistry, YellowBox } from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import App from './App';
import * as AnalyticsService from './App/services/AnalyticsService';

YellowBox.ignoreWarnings([
  'Class RCTCxxModule',
  'Warning:',
  'Method',
  'Module',
  'MOBIDEX:'
]);
EventEmitter.defaultMaxListeners = 1000;

AppRegistry.registerComponent('mobidex', () => App);

setJSExceptionHandler((error, isFatal) => {
  if (isFatal) {
    Alert.alert(
      'Unexpected error occurred',
      `Error: ${error.name} ${error.message}. We will need to restart the app.`,
      [
        {
          text: 'Restart',
          onPress: () => RNRestart.Restart()
        }
      ],
      { cancelable: false }
    );
  }

  AnalyticsService.trackEvent(isFatal ? 'crash' : 'error', 'report', {
    error: `${error.name} ${error.message}`
  });
}, true);

setNativeExceptionHandler(exceptionString => {
  AnalyticsService.trackEvent('crash', 'report', 'FATAL: ' + exceptionString);
});

import 'react-native-get-random-values';
import React, {useEffect, useRef, useState} from 'react';
import {AppState, Platform, StatusBar, StyleSheet, View} from 'react-native';
import RootNavigation from './src/navigations/RootNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {APP_CREDENTIALS, GLOBAL_CONSTANT} from './src/constant/globalConstants';
import {useGlobalData} from './src/context/AppContext';
import AppLoader, {loaderRef} from './src/components/common/AppLoader';
import fetch from 'cross-fetch';
import {
  getFcmToken,
  initializeAppStateListener,
  registerListenerWithFCM,
} from './src/utils/firebaseConfig';
import notifee from '@notifee/react-native';

const App = () => {
  const {userToken, countryData, userData} = useGlobalData();
  useEffect(() => {
    getFcmToken();
  }, []);

  useEffect(() => {
    const unsubscribe = registerListenerWithFCM();
    return unsubscribe;
  }, []);

  useEffect(() => {
    const clearBadge = async () => {
      await notifee.setBadgeCount(0); // Reset badge count
    };
    initializeAppStateListener();
    clearBadge();
  }, []);

  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  // useEffect(() => {
  //   const subscription = AppState.addEventListener(
  //     'change',
  //     _handleAppStateChange,
  //   );

  //   return () => {
  //     subscription.remove();

  //     // AppState.removeEventListener('change', _handleAppStateChange);
  //   };
  // }, []);

  // const _handleAppStateChange = nextAppState => {
  //   if (
  //     appState.current.match(/inactive|background/) &&
  //     nextAppState === 'active'
  //   ) {
  //     console.log('App has come to the foreground');
  //   }
  //   appState.current = nextAppState;
  //   setAppStateVisible(appState.current);
  // };
  // console.log('appStateVisible------', appStateVisible);

  const httpLink = createHttpLink({
    uri: APP_CREDENTIALS.API_URL,
    fetch,
  });

  // console.log('userData////////////', userData);
  // console.log('countryData////////////', countryData);
  // useEffect(() => {
  //   if (
  //     userData?.ca_vendor_country == GLOBAL_CONSTANT.UAE ||
  //     countryData == GLOBAL_CONSTANT.UAE
  //   ) {
  //     setAuthHeader('ueaview');
  //   }
  //   if (
  //     userData?.ca_vendor_country == GLOBAL_CONSTANT.UK ||
  //     countryData == GLOBAL_CONSTANT.UK
  //   ) {
  //     setAuthHeader('default');
  //   } else {
  //     setAuthHeader('');
  //   }
  // }, [userData, countryData]);

  const authLink = setContext(async (_, {headers}) => {
    // console.log('Sending headers:', {
    //   authorization: userToken ? `Bearer ${userToken}` : '',
    //   store:
    //     countryData === GLOBAL_CONSTANT.UAE ||
    //     userData?.ca_vendor_country === GLOBAL_CONSTANT.UAE
    //       ? 'ueaview'
    //       : countryData === GLOBAL_CONSTANT.UK ||
    //         userData?.ca_vendor_country === GLOBAL_CONSTANT.UK
    //       ? 'default'
    //       : '',
    // });

    return {
      headers: {
        ...headers,
        authorization: userToken ? `Bearer ${userToken}` : '',
        store:
          countryData === GLOBAL_CONSTANT.UAE ||
          userData?.ca_vendor_country === GLOBAL_CONSTANT.UAE
            ? 'ueaview'
            : countryData === GLOBAL_CONSTANT.UK ||
              userData?.ca_vendor_country === GLOBAL_CONSTANT.UK
            ? 'default'
            : '',
      },
    };
  });

  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    ssrForceFetchDelay: 0,
    defaultOptions,
  });

  const Container = Platform.OS === 'android' ? View : View;

  return (
    <Container style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent={true} />
      <ApolloProvider client={client}>
        <NavigationContainer>
          <AppLoader ref={loaderRef} />
          <RootNavigation />
        </NavigationContainer>
      </ApolloProvider>
    </Container>
  );
};
export default App;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
